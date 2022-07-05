import * as THREE from "three";
import {
    Tween
} from "../../libs/tween";
import {
    Card
} from "./Card";
import { Globals } from "./Globals";
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


const loc = new THREE.Vector3();
const tar = new THREE.Vector3( );
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
        curve.getPointAt(0, this.token.position);
        curve.getPointAt(0.01, tar);
        this.token.lookAt(tar);
    }

    awaitButtonPress( allowedButtons: number[ ] ): Promise < number > {
        const scope = this;
        const p = new Promise < number > ( ( resolve, reject ) => {
            const int = setInterval( ( ) => {
                for ( let i = 0; i < allowedButtons.length; i++ ) {
                    if ( scope.gamepad.buttons[ allowedButtons[ i ] ].pressed ) {
                        clearInterval( int );
                        resolve( allowedButtons[ i ] );
                    }
                }
            }, 1 );
        } );
        return p;
    }

    awaitButtonPressFor( allowedButtons: number[ ], timeoutMs: number ): Promise < number > {
        const scope = this;
        const p = new Promise < number > ( ( resolve, reject ) => {
            const int = setInterval( ( ) => {
                for ( let i = 0; i < allowedButtons.length; i++ ) {
                    if ( scope.gamepad.buttons[ allowedButtons[ i ] ].pressed ) {
                        clearInterval( int );
                        clearTimeout( t );
                        resolve( allowedButtons[ i ] );
                    }
                }
            }, 1 );

            const t = setTimeout( ( ) => {
                clearInterval( int );
                clearTimeout( t );
                reject( "Took Too long to collect rent" );
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

    goToPosition( position: number ) {
        const currentT = tilePositions[ this.currentPos ];
        let intT = tilePositions[ position ];
        const scope = this;

        if ( intT < currentT ) {
            intT++;
            if(!this.inJail) this.money += 200;
        }
        loc.set(200, 100, 0);

        this.token.localToWorld(loc);
        new Tween(Globals.camera.position).to(loc, 3000).start().onUpdate(() => {
            Globals.camera.lookAt(scope.token.position);
        }).onComplete(() => {
            scope.token.add(Globals.camera);
            Globals.camera.position.set(200, 100, 0);
            Globals.camera.lookAt(scope.token.position);
            new Tween( {
                a: currentT
            } ).to( {
                a: intT
            }, Math.log2( Number( intT > 1 ) * 40 + position - scope.currentPos ) * 1500 ).onUpdate( obj => {
                curve.getPointAt( obj.a % 1, scope.token.position );
                curve.getPointAt( ( obj.a + 0.01 ) % 1, tar );
                scope.token.lookAt( tar );
            } ).onComplete( ( ) => {
                scope.currentPos = position;
                scope.token.remove(Globals.camera);
                scope.token.localToWorld(Globals.camera.position);
                loc.set(0, 2000, 0);
                new Tween(Globals.camera.position).to(loc, 3000).start().onUpdate(() => {
                    Globals.camera.lookAt(0, 0, 0);
                });
            } ).start( );
        })
    }

    moveForward( spaces: number ) {
        this.goToPosition( this.currentPos + spaces );
    }

    moveBackward( spaces: number ) {
        this.goToPosition( this.currentPos - spaces );
    }
}