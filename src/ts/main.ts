import * as THREE from "three";
import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";
import {
    EXRLoader
} from "three/examples/jsm/loaders/EXRLoader";
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
import {
    O_BUTTON,
    SQUARE_BUTTON,
    TRIANGLE_BUTTON,
    X_BUTTON
} from "./logic/PS4Buttons";

const {
    innerWidth: width,
    innerHeight: height
} = window;

const animations: {
    show( ): Promise < void > ,
    hide( ): Promise < void >
} = {
    async show( ) {},
    async hide( ) {}
};

{
    const cover = document.getElementsByClassName( "cover" )[ 0 ] as HTMLDivElement;
    document.body.appendChild( cover );

    const showEffect = new KeyframeEffect( cover, [ {
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
    } );

    const hideEffect = new KeyframeEffect( cover, [ {
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
    } );

    animations.show = function( ) {
        const showAnimation = new Animation( showEffect, document.timeline );

        return new Promise( ( resolve ) => {
            function onEnd( ) {
                showAnimation.removeEventListener( "finish", onEnd );
                resolve( );
            }
            showAnimation.addEventListener( "finish", onEnd );
            showAnimation.play( );
        } );
    }

    animations.hide = function( ) {
        const hideAnimation = new Animation( hideEffect, document.timeline );

        return new Promise( ( resolve ) => {
            function onEnd( ) {
                hideAnimation.removeEventListener( "finish", onEnd );
                resolve( );
            }
            hideAnimation.addEventListener( "finish", onEnd );
            hideAnimation.play( );
        } );
    }
}

const renderer = new THREE.WebGLRenderer( );
renderer.setSize( width, height );
renderer.setClearColor( 0xBFD1E5 );
document.getElementById( "game" ).appendChild( renderer.domElement );

const scene = new THREE.Scene( );

const camera = new THREE.PerspectiveCamera( 75, width / height, 100, 3000 );
camera.position.y = 1000;
camera.position.x = 2000;
Globals.camera = camera;

const dLight = new THREE.DirectionalLight( );
scene.add( dLight );

const pmrem = new THREE.PMREMGenerator( renderer );

const loaded = {
    die: false,
    board: false,
    environment: false,
    ran: false
};

const loader = new GLTFLoader( );
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
    loaded.die = true;
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

    loaded.board = true;
} );

async function gameLoop( ) {
    if ( Globals.players.length == 1 ) return;

    for ( const player of Globals.players ) {
        //eslint-disable-next-line no-inner-declarations
        async function onPress( button: number ) {
            if ( button == O_BUTTON ) {
                await player.moveForward( await Dice.rollDice( ) );
            } else {
                await player.showStats( );
                player.awaitButtonPress( [ O_BUTTON, SQUARE_BUTTON ] ).then( onPress );
            }
        }

        player.awaitButtonPress( [ O_BUTTON, SQUARE_BUTTON ] ).then( onPress );
    }

    gameLoop( );
}

async function onLoad( ) {
    const screens = document.getElementById( "screens" ).children as unknown as HTMLDivElement[ ];
    screens[ 0 ].style.display = "block";
    await wait( 1000 );
    await animations.show( );
    const numPlayers = await new Promise < number > ( ( resolve ) => {
        const buttons = document.getElementsByClassName( "numButton" ) as unknown as HTMLButtonElement[ ];

        function onClick( event: MouseEvent ) {
            for ( const button of buttons ) {
                button.removeEventListener( "click", onClick );
            }

            resolve( parseInt( ( event.target as HTMLButtonElement ).innerHTML ) );
        }

        for ( const button of buttons ) {
            button.addEventListener( "click", onClick );
        }
    } );

    await animations.hide( );
    screens[ 0 ].style.display = "none";
    screens[ 1 ].style.display = "block";
    await wait( 250 );
    await animations.show( );
    const names = await new Promise < string[ ] > ( ( resolve ) => {
        const input = document.getElementById( "nameInput" ) as HTMLInputElement;
        const button = document.getElementById( "submitName" ) as HTMLButtonElement;

        let names: string[ ] = [ ];

        function onClick( ) {
            names.push( input.value );
            input.value = "";
            if ( names.length == numPlayers ) {
                button.removeEventListener( "click", onClick );
                resolve( names );
            }
        }

        button.addEventListener( "click", onClick );
    } );

    await animations.hide( );
    screens[ 1 ].style.display = "none";
    screens[ 2 ].style.display = "block";
    await wait( 250 );
    await animations.show( );
    await wait( 500 );
    await new Promise < void > ( ( resolve ) => {
        let controllers = 0;
        const messages = [
            `Could ${names[0]} please connect their controller`,
            `Could ${names[1]} please connect their controller`,
            `Could ${names[2]} please connect their controller`,
            `Could ${names[3]} please connect their controller`
        ];

        const body = document.getElementById( "connectTag" ) as HTMLParagraphElement;

        function onConnect( ) {
            controllers++;
            if ( controllers == numPlayers ) {
                window.removeEventListener( "gamepadconnected", onConnect );
                resolve( );
            } else {
                body.innerHTML = messages[ controllers ];
            }
        }

        body.innerHTML = messages[ 0 ];
        window.addEventListener( "gamepadconnected", onConnect );
    } );

    const unused = [
        "hat", "iron", "thimble", "barrow"
    ];

    await animations.hide( );
    screens[ 2 ].style.display = "none";
    screens[ 3 ].style.display = "block";
    await wait( 250 );
    await animations.show( );

    Globals.players = await new Promise < Player[ ] > ( ( resolve ) => {
        const players: Player[ ] = [ ];

        const images = Array.from( document.getElementsByClassName( "tokenImage" ) ) as HTMLImageElement[ ];
        let ind = 0;

        function onClick( event: MouseEvent ) {
            const t = event.target as HTMLImageElement;
            t.removeEventListener( "click", onClick );
            images.splice( images.indexOf( t ), 1 );
            const alt = t.alt as( "hat" | "iron" | "thimble" | "barrow" );
            unused.splice( unused.indexOf( alt ), 1 );

            players.push( new Player( ind, names[ ind ], assets.tokens[ alt ] ) );
            ind++;
            if ( ind == numPlayers ) {
                for ( const image of images ) {
                    image.removeEventListener( "click", onClick );
                }

                for ( const token of unused ) {
                    assets.tokens[ token as( "hat" | "iron" | "thimble" | "barrow" ) ].visible = false;
                }
                resolve( players );
            }
        }

        for ( const image of images ) {
            image.addEventListener( "click", onClick );
        }
    } );

    await animations.hide( );
    screens[ 3 ].style.display = "none";
    screens[ 4 ].style.display = "block";
    await wait( 250 );
    await animations.show( );

    const buttonCheck = document.getElementById( "buttonTag" ) as HTMLParagraphElement;

    const buttons = {
        "Circle": O_BUTTON,
        "Triangle": TRIANGLE_BUTTON,
        "Square": SQUARE_BUTTON,
        "X": X_BUTTON
    };
    const buttonKeys = Object.keys( buttons );

    for ( const i in Globals.players ) {
        const player = Globals.players[ i ];
        const button = buttonKeys[ Math.random( ) * 4 | 0 ];
        buttonCheck.innerHTML = `Could ${names[i]} please hit the ${button} button`;
        await player.awaitButtonPress( buttons[ button ] );
    }

    await animations.hide( );
    screens[ 4 ].style.display = "none";
    screens[ 5 ].style.display = "block";
    await wait( 250 );
    await animations.show( );

    await gameLoop( );
}

const hdrLoader = new EXRLoader( );
hdrLoader.load( "../resources/exr/noon_grass_4k.exr", function( texture ) {
    scene.environment = pmrem.fromEquirectangular( texture ).texture;
    loaded.environment = true;
} )

function animate( ) {
    TWEEN.update( );
    Dice.update( );

    renderer.render( scene, camera );

    if ( loaded.die && loaded.board && loaded.environment && !loaded.ran ) {
        loaded.ran = true;
        onLoad( );
    }

    requestAnimationFrame( animate );
}
animate( );

function wait( ms: number ) {
    return new Promise( ( resolve ) => {
        setTimeout( resolve, ms );
    } )
}