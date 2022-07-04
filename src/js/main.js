import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as TWEEN from "../libs/tween";
import { GUI } from "dat.gui";
const { innerWidth: width, innerHeight: height } = window;
//go = 0, mediteranean = .0333, CC1 = .0570, baltic = 0.0810, income = .1046, RR = 0.1280, oriental = 0.153, Chance1 = .1767, vermont = .2010, connecticut = .2245
//jail = .255, charles = .2830, eclec = .3070, states = .3300, virginia = .3550, PR = .38, james = .403, CC2 = .426, tennessee = .451, NY = .475
//FP = .5, kent = .5333, Chance2 = 0.557, ind = .5815, ill = .6047, BOR = 6290, atlas = .652, vernot = .6765, tears = .7, topiary = .724,
//Wee Woo = .754, Ocean = .7820, NC = .8065, CC3 = .831, Penn = .855, SL = .8795, Chance3 = .903, trees = .9265, marriage = .9505, planks = .975
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xBFD1E5);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 100, 3000);
camera.position.y = 1000;
camera.position.x = 2000;
const dLight = new THREE.DirectionalLight();
scene.add(dLight);
//eslint-disable-next-line no-unused-vars
const controls = new OrbitControls(camera, renderer.domElement);
const pmrem = new THREE.PMREMGenerator(renderer);
const loader = new GLTFLoader();
const pieces = new THREE.Group();
//eslint-disable-next-line no-unused-vars
const gui = new GUI();
const curve = new THREE.CatmullRomCurve3([
	new THREE.Vector3(600, 0, -625),
	new THREE.Vector3(625, 0, -600),
	new THREE.Vector3(625, 0, 600),
	new THREE.Vector3(600, 0, 625),
	new THREE.Vector3(-600, 0, 625),
	new THREE.Vector3(-625, 0, 600),
	new THREE.Vector3(-625, 0, -600),
	new THREE.Vector3(-600, 0, -625)
], true);
const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(curve.getPoints(250)), new THREE.LineBasicMaterial({
	color: "red"
}));
scene.add(line);
let tween;
loader.load("../scene.glb", function (gltf) {
	const names = ["Top_Hat_09_-_Default_0", "Iron_09_-_Default_0", "Wheel_Barrow_09_-_Default_0", "Thimble_09_-_Default_0"];
	for (const name of names) {
		const o = gltf.scene.getObjectByName(name);
		o.geometry.rotateX(-Math.PI / 2);
		o.geometry.rotateY(Math.PI / 2);
		pieces.add(o);
	}
	controls.enabled = false;
	camera.position.set(100, 200, 0);
	camera.lookAt(0, 0, 0);
	pieces.children[1].add(camera);
	tween = new TWEEN.Tween(pieces.children[0].position).to({
		x: 625
	}, 15000).easing(TWEEN.Easing.Quintic.InOut).start();
	pieces.add(gltf.scene.getObjectByName("Board_01_-_Default_0"));
	pieces.children[4].geometry.rotateX(-Math.PI / 2);
	pieces.children[4].position.z = -5;
	scene.add(pieces);
});
const hdrLoader = new RGBELoader();
hdrLoader.load("https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr", function (texture) {
	scene.environment = pmrem.fromEquirectangular(texture).texture;
});
const tar = new THREE.Vector3();
function animate(t) {
	if (tween) {
		curve.getPointAt((t / 15000) % 1, pieces.children[1].position);
		curve.getPointAt((t / 15000 + 0.01) % 1, tar);
		pieces.children[1].lookAt(tar);
	}
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate(0);
