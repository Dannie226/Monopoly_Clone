import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as TWEEN from "../libs/tween";
import { GUI } from "dat.gui";
import { Globals } from "./logic/Globals";
import { Dice } from "./logic/Dice";
import CannonDebugger from "cannon-es-debugger";
const { innerWidth: width, innerHeight: height } = window;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xBFD1E5);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 100, 3000);
camera.position.y = 1000;
camera.position.x = 2000;
Globals.camera = camera;
const dLight = new THREE.DirectionalLight();
scene.add(dLight);
const pmrem = new THREE.PMREMGenerator(renderer);
const loader = new GLTFLoader();
const pieces = new THREE.Group();
let d;
//eslint-disable-next-line no-unused-vars
const gui = new GUI();
//eslint-disable-next-line no-unused-vars
const controls = new OrbitControls(camera, renderer.domElement);
loader.load("../die.glb", (gltf) => {
    Dice.init();
    d = CannonDebugger(scene, Dice.getWorld());
    const dieMesh = gltf.scene.getObjectByName("Box001_Material_#25_0");
    dieMesh.geometry.center();
    dieMesh.geometry.computeBoundingBox();
    const s = dieMesh.geometry.boundingBox.getSize(new THREE.Vector3);
    console.log(s.x, s.y, s.z);
    scene.add(Dice.createDie(dieMesh).getMesh());
    scene.add(Dice.createDie().getMesh());
    Dice.roll();
});
loader.load("../board.glb", (gltf) => {
    const names = ["Top_Hat_09_-_Default_0", "Iron_09_-_Default_0", "Wheel_Barrow_09_-_Default_0", "Thimble_09_-_Default_0"];
    for (const name of names) {
        const o = gltf.scene.getObjectByName(name);
        o.geometry.rotateX(-Math.PI / 2);
        o.geometry.rotateY(Math.PI / 2);
        pieces.add(o);
    }
    camera.position.set(0, 975, 0);
    camera.quaternion.set(-Math.SQRT1_2, 0, 0, Math.SQRT1_2);
    // const p = new Player( null, "Daniel", pieces.children[ 1 ] as THREE.Mesh );
    // const h = new Player( null, "Nate", pieces.children[ 0 ] as THREE.Mesh );
    // p.goToPosition( 11 ).then( ( ) => {
    //     setTimeout( ( ) => {
    //         p.goToPosition( 10 ).then( ( ) => {
    //             p.moveBackward( 3 ).then( ( ) => {
    //                 p.moveForward( 8 ).then( ( ) => {
    //                     h.goToPosition( 25 );
    //                 } );
    //             } );
    //         } );
    //     }, 3000 );
    // } )
    pieces.add(gltf.scene.getObjectByName("Board_01_-_Default_0"));
    pieces.children[4].geometry.rotateX(-Math.PI / 2);
    pieces.children[4].position.z = -5;
    scene.add(pieces);
});
const hdrLoader = new RGBELoader();
hdrLoader.load("https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr", function (texture) {
    scene.environment = pmrem.fromEquirectangular(texture).texture;
});
function animate() {
    TWEEN.update();
    Dice.update();
    if (d)
        d.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
