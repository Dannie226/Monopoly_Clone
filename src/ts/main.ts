import * as THREE from "three";
import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import {
    RGBELoader
} from "three/examples/jsm/loaders/RGBELoader";
import * as TWEEN from "../libs/tween";

const {
    innerWidth: width,
    innerHeight: height
} = window;

const renderer = new THREE.WebGLRenderer( );
renderer.setSize( width, height );
renderer.setClearColor( 0xBFD1E5 );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene( );

const camera = new THREE.PerspectiveCamera( 75, width / height, 100, 3000 );
camera.position.y = 1000;
camera.position.x = 2000;

const dLight = new THREE.DirectionalLight( );
scene.add( dLight );

//eslint-disable-next-line no-unused-vars
const controls = new OrbitControls( camera, renderer.domElement );

const pmrem = new THREE.PMREMGenerator( renderer );

const loader = new GLTFLoader( );

const pieces = new THREE.Group( );

let tween:TWEEN.Tween<THREE.Vector3>;

loader.load( "../scene.glb", function( gltf ) {
    pieces.add( gltf.scene.getObjectByName( "Top_Hat_09_-_Default_0" ) );
    pieces.add( gltf.scene.getObjectByName( "Iron_09_-_Default_0" ) );
    pieces.add( gltf.scene.getObjectByName( "Wheel_Barrow_09_-_Default_0" ) );
    pieces.add( gltf.scene.getObjectByName( "Thimble_09_-_Default_0" ) );

    pieces.children[0].position.set(-625,-625, 0);
    pieces.children[1].position.set( 625,-625, 0);
    pieces.children[2].position.set(-625, 625, 0);
    pieces.children[3].position.set( 625, 625, 0);

    tween = new TWEEN.Tween(pieces.children[0].position).to({x:625}, 15000).easing(TWEEN.Easing.Bounce.Out);

    pieces.add( gltf.scene.getObjectByName( "Board_01_-_Default_0" ) );

    pieces.children[ 4 ].position.z = -5;
    pieces.rotation.x = -Math.PI / 2;

    scene.add( pieces );
} );

const hdrLoader = new RGBELoader( );
hdrLoader.load( "https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr", function( texture ) {
    scene.environment = pmrem.fromEquirectangular( texture ).texture;
} )

function animate( ) {
    if(tween) tween.update();
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
animate( );