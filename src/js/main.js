import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as TWEEN from "../libs/tween";
import { Player } from "./logic/Player";
import { Globals } from "./logic/Globals";
import { Dice } from "./logic/Dice";
import { O_BUTTON, SQUARE_BUTTON, TRIANGLE_BUTTON, X_BUTTON } from "./logic/PS4Buttons";
const { innerWidth: width, innerHeight: height } = window;
const animations = {
	async show() { },
	async hide() { }
};
{
	const cover = document.getElementsByClassName("cover")[0];
	document.body.appendChild(cover);
	const showEffect = new KeyframeEffect(cover, [{
		width: "100%",
		height: "100%"
	},
	{
		width: "0px",
		height: "0px"
	}
	], {
		duration: 1000,
		easing: "ease-out",
		fill: "forwards"
	});
	const hideEffect = new KeyframeEffect(cover, [{
		width: "0px",
		height: "0px"
	},
	{
		width: "100%",
		height: "100%"
	}
	], {
		duration: 1000,
		easing: "ease-in",
		fill: "forwards"
	});
	animations.show = function () {
		const showAnimation = new Animation(showEffect, document.timeline);
		return new Promise((resolve) => {
			function onEnd() {
				showAnimation.removeEventListener("finish", onEnd);
				resolve();
			}
			showAnimation.addEventListener("finish", onEnd);
			showAnimation.play();
		});
	};
	animations.hide = function () {
		const hideAnimation = new Animation(hideEffect, document.timeline);
		return new Promise((resolve) => {
			function onEnd() {
				hideAnimation.removeEventListener("finish", onEnd);
				resolve();
			}
			hideAnimation.addEventListener("finish", onEnd);
			hideAnimation.play();
		});
	};
}
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xBFD1E5);
document.getElementById("game").appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 100, 3000);
camera.position.y = 1000;
camera.position.x = 2000;
Globals.camera = camera;
const dLight = new THREE.DirectionalLight();
scene.add(dLight);
let loaded = false;
const assets = {
	tokens: {
		hat: null,
		iron: null,
		barrow: null,
		thimble: null
	},
	board: null
};
async function loadAssets() {
	const gltfLoader = new GLTFLoader();
	const hdrLoader = new RGBELoader();
	const gameModel = (await gltfLoader.loadAsync("../resources/models/board.glb")).scene;
	const dieModel = (await gltfLoader.loadAsync("../resources/models/die.glb")).scene;
	const tableModel = (await gltfLoader.loadAsync("../resources/models/table.glb")).scene;
	const background = await hdrLoader.loadAsync("../resources/hdr/soliltude_2k.hdr");
	//background/environment
	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromEquirectangular(background).texture;
	scene.background = background;
	scene.background.mapping = THREE.EquirectangularReflectionMapping;
	//dice
	Dice.init();
	const dieMesh = dieModel.getObjectByName("Box001_Material_#25_0");
	dieMesh.geometry.center();
	scene.add(Dice.createDie(dieMesh).getMesh());
	scene.add(Dice.createDie().getMesh());
	//game assets (tokens, board, and houses)
	const names = ["Top_Hat_09_-_Default_0", "Iron_09_-_Default_0", "Wheel_Barrow_09_-_Default_0", "Thimble_09_-_Default_0"];
	const tokens = [];
	for (const name of names) {
		const o = gameModel.getObjectByName(name);
		o.geometry.rotateX(-Math.PI / 2);
		o.geometry.rotateY(Math.PI / 2);
		scene.add(o);
		tokens.push(o);
	}
	assets.tokens.hat = tokens[0];
	assets.tokens.iron = tokens[1];
	assets.tokens.barrow = tokens[2];
	assets.tokens.thimble = tokens[3];
	assets.tokens.barrow.visible = assets.tokens.thimble.visible = false;
	camera.position.set(0, 975, 0);
	camera.quaternion.set(-Math.SQRT1_2, 0, 0, Math.SQRT1_2);
	assets.board = gameModel.getObjectByName("Board_01_-_Default_0");
	assets.board.geometry.rotateX(-Math.PI / 2);
	assets.board.position.y = -5;
	scene.add(assets.board);
	const house = gameModel.getObjectByName("House_07_-_Default_0");
	house.geometry.rotateX(-Math.PI / 2);
	house.geometry.scale(1 / 3, 1 / 3, 1 / 3);
	Globals.houseMesh = new THREE.InstancedMesh(house.geometry, house.material, 112);
	Globals.houseMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
	scene.add(Globals.houseMesh);
	//table
	const s = 1575;
	tableModel.scale.setScalar(s);
	tableModel.position.y = -s - 6;
	scene.add(tableModel);
	loaded = true;
}
async function gameLoop() {
	if (Globals.players.length == 1)
		return;
	for (const player of Globals.players) {
		//eslint-disable-next-line no-inner-declarations
		async function onPress(button) {
			if (button == O_BUTTON) {
				await player.moveForward(await Dice.rollDice());
			}
			else {
				await player.showStats();
				player.awaitButtonPress([O_BUTTON, SQUARE_BUTTON]).then(onPress);
			}
		}
		player.awaitButtonPress([O_BUTTON, SQUARE_BUTTON]).then(onPress);
	}
	gameLoop();
}
async function onLoad() {
	const screens = document.getElementById("screens").children;
	screens[0].style.display = "block";
	await wait(1000);
	await animations.show();
	const numPlayers = await new Promise((resolve) => {
		const buttons = document.getElementsByClassName("numButton");
		function onClick(event) {
			for (const button of buttons) {
				button.removeEventListener("click", onClick);
			}
			resolve(parseInt(event.target.innerHTML));
		}
		for (const button of buttons) {
			button.addEventListener("click", onClick);
		}
	});
	await animations.hide();
	screens[0].style.display = "none";
	screens[1].style.display = "block";
	await wait(250);
	await animations.show();
	const names = await new Promise((resolve) => {
		const input = document.getElementById("nameInput");
		const button = document.getElementById("submitName");
		let names = [];
		function onClick() {
			names.push(input.value);
			input.value = "";
			if (names.length == numPlayers) {
				button.removeEventListener("click", onClick);
				resolve(names);
			}
		}
		button.addEventListener("click", onClick);
	});
	await animations.hide();
	screens[1].style.display = "none";
	screens[2].style.display = "block";
	await wait(250);
	await animations.show();
	await wait(500);
	await new Promise((resolve) => {
		let controllers = 0;
		const messages = [
			`Could ${names[0]} please connect their controller`,
			`Could ${names[1]} please connect their controller`,
			`Could ${names[2]} please connect their controller`,
			`Could ${names[3]} please connect their controller`
		];
		const body = document.getElementById("connectTag");
		function onConnect() {
			controllers++;
			if (controllers == numPlayers) {
				window.removeEventListener("gamepadconnected", onConnect);
				resolve();
			}
			else {
				body.innerHTML = messages[controllers];
			}
		}
		body.innerHTML = messages[0];
		window.addEventListener("gamepadconnected", onConnect);
	});
	const unused = [
		"hat", "iron", "thimble", "barrow"
	];
	await animations.hide();
	screens[2].style.display = "none";
	screens[3].style.display = "block";
	await wait(250);
	await animations.show();
	Globals.players = await new Promise((resolve) => {
		const players = [];
		const images = Array.from(document.getElementsByClassName("tokenImage"));
		let ind = 0;
		function onClick(event) {
			const t = event.target;
			t.removeEventListener("click", onClick);
			images.splice(images.indexOf(t), 1);
			const alt = t.alt;
			unused.splice(unused.indexOf(alt), 1);
			players.push(new Player(ind, names[ind], assets.tokens[alt]));
			ind++;
			if (ind == numPlayers) {
				for (const image of images) {
					image.removeEventListener("click", onClick);
				}
				for (const token of unused) {
					assets.tokens[token].visible = false;
				}
				resolve(players);
			}
		}
		for (const image of images) {
			image.addEventListener("click", onClick);
		}
	});
	await animations.hide();
	screens[3].style.display = "none";
	screens[4].style.display = "block";
	await wait(250);
	await animations.show();
	const buttonCheck = document.getElementById("buttonTag");
	const buttons = {
		"Circle": O_BUTTON,
		"Triangle": TRIANGLE_BUTTON,
		"Square": SQUARE_BUTTON,
		"X": X_BUTTON
	};
	const buttonKeys = Object.keys(buttons);
	for (const i in Globals.players) {
		const player = Globals.players[i];
		const button = buttonKeys[Math.random() * 4 | 0];
		buttonCheck.innerHTML = `Could ${names[i]} please hit the ${button} button`;
		await player.awaitButtonPress(buttons[button]);
	}
	await animations.hide();
	screens[4].style.display = "none";
	screens[5].style.display = "block";
	await wait(250);
	await animations.show();
	await gameLoop();
}
function animate() {
	TWEEN.update();
	Dice.update();
	renderer.render(scene, camera);
	if (loaded) {
		loaded = false;
		onLoad();
	}
	requestAnimationFrame(animate);
}
loadAssets();
animate();
function wait(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
