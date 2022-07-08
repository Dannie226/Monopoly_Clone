import * as THREE from "three";
import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";
import {
    RGBELoader
} from "three/examples/jsm/loaders/RGBELoader";
import * as TWEEN from "../libs/tween";
import {
    Player
} from "./logic/Player";
import {
    Globals
} from "./logic/Globals";
import {
    Dice
} from "./logic/Dice";

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

const pmrem = new THREE.PMREMGenerator( renderer );

const manager = new THREE.LoadingManager( );
const loader = new GLTFLoader( manager );
const assets = {
    tokens: {
        hat: null as THREE.Mesh,
        iron: null as THREE.Mesh,
        barrow: null as THREE.Mesh,
        thimble: null as THREE.Mesh
    },
    board: null as THREE.Mesh
}

loader.load( "../resources/models/die.glb", ( gltf ) => {
    Dice.init( );
    const dieMesh = gltf.scene.getObjectByName( "Box001_Material_#25_0" ) as THREE.Mesh;
    dieMesh.geometry.center( );
    scene.add( Dice.createDie( dieMesh ).getMesh( ) );
    scene.add( Dice.createDie( ).getMesh( ) );
} );

loader.load( "../resources/models/board.glb", ( gltf ) => {
    const names = [ "Top_Hat_09_-_Default_0", "Iron_09_-_Default_0", "Wheel_Barrow_09_-_Default_0", "Thimble_09_-_Default_0" ];
    const tokens: THREE.Mesh[ ] = [ ];

    for ( const name of names ) {
        const o = gltf.scene.getObjectByName( name ) as THREE.Mesh;
        o.geometry.rotateX( -Math.PI / 2 );
        o.geometry.rotateY( Math.PI / 2 );
        scene.add( o );
        tokens.push( o );
    }

    assets.tokens.hat = tokens[ 0 ];
    assets.tokens.iron = tokens[ 1 ];
    assets.tokens.barrow = tokens[ 2 ];
    assets.tokens.thimble = tokens[ 3 ];

    assets.tokens.barrow.visible = assets.tokens.thimble.visible = false;

    camera.position.set( 0, 975, 0 );
    camera.quaternion.set( -Math.SQRT1_2, 0, 0, Math.SQRT1_2 );

    assets.board = gltf.scene.getObjectByName( "Board_01_-_Default_0" ) as THREE.Mesh;
    assets.board.geometry.rotateX( -Math.PI / 2 );
    assets.board.position.y = -5;

    scene.add( assets.board );

    const house = gltf.scene.getObjectByName( "House_07_-_Default_0" ) as THREE.Mesh;
    house.geometry.rotateX( -Math.PI / 2 );
    house.geometry.scale( 1 / 3, 1 / 3, 1 / 3 );

    Globals.houseMesh = new THREE.InstancedMesh( house.geometry, house.material, 112 );
    Globals.houseMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
    scene.add( Globals.houseMesh );
} );

manager.onLoad = async function( ) {
    // const p = new Player( 0, "Daniel", assets.tokens.iron );
    // const h = new Player( 1, "Nate", assets.tokens.hat );

    // for ( let i = 0; i < 5; i++ ) {
    //     await p.moveForward( await Dice.rollDice( ) );
    //     await wait( 500 );
    //     await h.moveForward( await Dice.rollDice( ) );
    //     await wait( 500 );
    // }
}

const hdrLoader = new RGBELoader( );
hdrLoader.load( "https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr", function( texture ) {
    scene.environment = pmrem.fromEquirectangular( texture ).texture;
} )

function animate( ) {
    TWEEN.update( );
    Dice.update( );

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
animate( );

// function wait( ms: number ) {
//     return new Promise( ( resolve ) => {
//         setTimeout( resolve, ms );
//     } )
// }