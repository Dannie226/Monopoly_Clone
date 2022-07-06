import * as THREE from "three";
import {
    Easing,
    Tween
} from "../../libs/tween";
import {
    Card
} from "./Card";
import {
    Globals
} from "./Globals";
import {
    Property
} from "./Property";

//go = 0, mediteranean = .0333, CC1 = .0570, baltic = 0.0810, income = .1046, RR = 0.1280, oriental = 0.153, Chance1 = .1767, vermont = .2010, connecticut = .2245
//jail = .255, charles = .2830, eclec = .3070, states = .3300, virginia = .3550, PR = .38, james = .403, CC2 = .426, tennessee = .451, NY = .475
//FP = .5, kent = .5333, Chance2 = 0.557, ind = .5815, ill = .6047, BOR = 6290, atlas = .652, vernot = .6765, tears = .7, topiary = .724,
//Wee Woo = .754, Ocean = .7820, NC = .8065, CC3 = .831, Penn = .855, SL = .8795, Chance3 = .903, trees = .9265, marriage = .9505, planks = .975

const tilePositions = [
    0.000, .0333, .0570, .0810, .1046, .1280, .1530, .1767, .2010, .2245, .2550, .2830, .3070, .3300, .3550, .3800, .4030, .4260, .4510, .4750,
    .5000, .5333, .5570, .5815, .6047, .6290, .6520, .6765, .7000, .7240, .7540, .7820, .8065, .8310, .8550, .8795, .9030, .9265, .9505, .9750
];

const curve = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( 625, 0, 600 ),
    new THREE.Vector3( 600, 0, 625 ),
    new THREE.Vector3( -600, 0, 625 ),
    new THREE.Vector3( -625, 0, 600 ),
    new THREE.Vector3( -625, 0, -600 ),
    new THREE.Vector3( -600, 0, -625 ),
    new THREE.Vector3( 600, 0, -625 ),
    new THREE.Vector3( 625, 0, -600 )
], true );

const v0 = new THREE.Vector3( );
const v1 = new THREE.Vector3( );
const q0 = new THREE.Quaternion( );
const q1 = new THREE.Quaternion( );
const fromIObj = {
    a: 0
};
const toIObj = {
    a: 1
}
export class Player {
    public gamepad: Gamepad;
    public token: THREE.Mesh;
    public name: String;
    public money: number = 1500;
    public propertyCount: number = 0;
    public properties: Property[ ] = [ ];
    public inJail: boolean = false;
    public chanceCard: Card = null;
    public communityChestCard: Card = null;
    public currentPos: number = 0;
    private statsPanel: HTMLDivElement = document.createElementNS( "http://www.w3.org/1999/xhtml", "div" ) as HTMLDivElement;

    constructor( gamepad: Gamepad, name: String, token: THREE.Mesh ) {
        this.gamepad = gamepad;
        this.name = name;
        this.statsPanel.className = "stats";
        this.token = token;
        curve.getPointAt( 0, this.token.position );
        curve.getPointAt( 0.01, v0 );
        this.token.lookAt( v0 );
    }

    awaitButtonPress( allowedButtons: number[ ] ): Promise < number > {
        const scope = this;
        const p = new Promise < number > ( ( resolve, reject ) => {
            const int = setInterval( ( ) => {
                for ( const button of allowedButtons) {
                    if ( scope.gamepad.buttons[button].pressed ) {
                        clearInterval( int );
                        resolve( button );
                    }
                }
            }, 17 );
        } );
        return p;
    }

    awaitButtonPressFor( allowedButtons: number[ ], timeoutMs: number ): Promise < number > {
        const scope = this;
        const p = new Promise < number > ( ( resolve, reject ) => {
            const i = setInterval( ( ) => {
                for ( const button of allowedButtons ) {
                    if ( scope.gamepad.buttons[ button ].pressed ) {
                        clearInterval( i );
                        clearTimeout( t );
                        resolve( button );
                    }
                }
            }, 17 );

            const t = setTimeout( ( ) => {
                clearInterval( i );
                clearTimeout( t );
                reject( "Took Too long to press button" );
            }, timeoutMs );
        } );
        return p;
    }

    updateStats( ) {

    }

    hideStats( ) {

    }

    showStats( ) {

    }

    goToPosition( position: number ):Promise<Player> {
        const currentT = tilePositions[ this.currentPos ];
        let intT = tilePositions[ position ];
        const scope = this,
            camera = Globals.camera;

        if ( intT < currentT ) {
            intT++;
            if ( !this.inJail ) this.money += 200;
        }
        const p = new Promise<Player>((resolve) => {
            v1.set( 200, 100, 0 );
            this.token.localToWorld( v1 );
    
            v0.copy( camera.position );
            camera.lookAt( 0, 0, 0 );
            q0.copy( camera.quaternion );
    
            camera.position.copy( v1 );
            camera.lookAt( this.token.position );
            q1.copy( camera.quaternion );
    
            fromIObj.a = 0;
            toIObj.a = 1;
            const camToTokenTween = new Tween( fromIObj ).to( toIObj, 3000 ).onUpdate( ( {
                a
            } ) => {
                camera.position.lerpVectors( v0, v1, a );
                camera.quaternion.slerpQuaternions( q0, q1, a );
            } ).onComplete( ( ) => {
                fromIObj.a = currentT;
                toIObj.a = intT;
    
                scope.token.add( camera );
                camera.position.set( 200, 100, 0 );
                camera.lookAt( scope.token.position );
    
                tokenToSpaceTween.start( );
            } ).easing( Easing.Quadratic.InOut );
            const tokenToSpaceTween = new Tween( fromIObj ).to( toIObj, Math.log2( Number( intT > 1 ) * 40 + position - scope.currentPos ) * 1500 ).onUpdate( ( {
                a
            } ) => {
                curve.getPointAt( a % 1, scope.token.position );
                curve.getPointAt( ( a + 0.01 ) % 1, v0 );
                scope.token.lookAt( v0 );
            } ).onComplete( ( ) => {
                scope.currentPos = position;
    
                scope.token.remove( camera );
    
                scope.token.localToWorld( camera.position );
                v0.copy( camera.position );
                camera.lookAt( scope.token.position );
                q0.copy( camera.quaternion );
    
                v1.set( 0, 975, 0 );
                q1.set( -Math.SQRT1_2, 0, 0, Math.SQRT1_2 );
    
                fromIObj.a = 0;
                toIObj.a = 1;
                camToOrigTween.start( );
            } ).delay( 500 ).easing( Easing.Sinusoidal.InOut );
    
            const camToOrigTween = new Tween( fromIObj ).to( toIObj, 3000 ).onUpdate( ( {
                a
            } ) => {
                camera.position.lerpVectors( v0, v1, a );
                camera.quaternion.slerpQuaternions( q0, q1, a );
            } ).delay( 500 ).easing( Easing.Quadratic.InOut ).onComplete(() => {resolve(scope)});
    
            camToTokenTween.start( );
        });

        return p;
    }

    moveForward( spaces: number ) {
        return this.goToPosition( this.currentPos + spaces );
    }

    moveBackward( spaces: number ) {
        return this.goToPosition( this.currentPos - spaces );
    }
}