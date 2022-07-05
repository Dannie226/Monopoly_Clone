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
import {
    GUI
} from "dat.gui";
import {
    Player
} from "./logic/Player";
import { Globals } from "./logic/Globals";
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
Globals.camera = camera;

const dLight = new THREE.DirectionalLight( );
scene.add( dLight );

//eslint-disable-next-line no-unused-vars
const controls = new OrbitControls( camera, renderer.domElement );

const pmrem = new THREE.PMREMGenerator( renderer );

const loader = new GLTFLoader( );

const pieces = new THREE.Group( );

//eslint-disable-next-line no-unused-vars
const gui = new GUI( );

loader.load( "../scene.glb", function( gltf ) {
    const names = [ "Top_Hat_09_-_Default_0", "Iron_09_-_Default_0", "Wheel_Barrow_09_-_Default_0", "Thimble_09_-_Default_0" ]
    for ( const name of names ) {
        const o = gltf.scene.getObjectByName( name );
        ( o as THREE.Mesh ).geometry.rotateX( -Math.PI / 2 );
        ( o as THREE.Mesh ).geometry.rotateY( Math.PI / 2 );
        pieces.add( o );
    }

    const p = new Player( null, "Daniel", pieces.children[ 1 ] as THREE.Mesh );

    p.goToPosition( 11 );

    setTimeout( p.goToPosition.bind( p, 10 ), 15000 );

    pieces.add( gltf.scene.getObjectByName( "Board_01_-_Default_0" ) );
    ( pieces.children[ 4 ] as THREE.Mesh ).geometry.rotateX( -Math.PI / 2 );
    pieces.children[ 4 ].position.z = -5;

    scene.add( pieces );
} );



const hdrLoader = new RGBELoader( );
hdrLoader.load( "https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr", function( texture ) {
    scene.environment = pmrem.fromEquirectangular( texture ).texture;
} )

function animate( ) {
    TWEEN.update( );
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
animate( );