import * as THREE from "three";
import {
    Easing,
    Tween
} from "../../libs/tween";
import {
    O_BUTTON,
    X_BUTTON,
    TRIANGLE_BUTTON,
    SQUARE_BUTTON
} from "./PS4Buttons";
import {
    Globals
} from "./Globals";
import {
    Property
} from "./Property";

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

export type useFunction = ( player: Player ) => void;

export class Player {
    public gamepadId: number;
    public token: THREE.Mesh;
    public name: string;
    public money: number = 1500;
    public propertyCount: number = 0;
    public properties: Property[ ] = [ ];
    public inJail: boolean = false;
    public jailTurns: number = 0;
    public chanceCard: useFunction = null;
    public communityChestCard: useFunction = null;
    public currentPos: number = 0;
    private statsPanel: HTMLDivElement = document.createElementNS( "http://www.w3.org/1999/xhtml", "div" ) as HTMLDivElement;
    private header: HTMLHeadingElement = document.createElementNS( "http://www.w3.org/1999/xhtml", "h1" ) as HTMLHeadingElement;
    private body: HTMLParagraphElement = document.createElementNS( "http://www.w3.org/1999/xhtml", "p" ) as HTMLParagraphElement;
    constructor( id: number, name: string, token: THREE.Mesh ) {
        this.gamepadId = id;
        this.name = name;
        this.statsPanel.className = "stats";
        this.token = token;
        curve.getPointAt( 0, this.token.position );
        curve.getPointAt( 0.01, v0 );
        this.token.lookAt( v0 );
        this.statsPanel.appendChild( this.header );
        this.statsPanel.appendChild( document.createElementNS( "http://www.w3.org/1999/xhtml", "hr" ) );
        this.statsPanel.appendChild( this.body );
        this.hideStats( );
        document.body.appendChild( this.statsPanel );
    }

    private getGamepad( ) {
        return navigator.getGamepads( )[ this.gamepadId ];
    }

    awaitButtonPress( allowedButtons: number[ ] ): Promise < number > {
        const scope = this;
        const p = new Promise < number > ( ( resolve, reject ) => {
            const i = setInterval( ( ) => {
                for ( const button of allowedButtons ) {
                    if ( scope.getGamepad( ).buttons[ button ].pressed ) {
                        clearInterval( i );
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
                    if ( scope.getGamepad( ).buttons[ button ].pressed ) {
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

    private async baseStats( ) {
        const scope = this;
        scope.header.innerHTML = this.name;
        scope.body.innerText = `Money: ${this.money}
Num Properties: ${this.properties.length}
Properties > Circle
Close > Square`;
        const button = await scope.awaitButtonPress( [ O_BUTTON, SQUARE_BUTTON ] )
        if ( button == O_BUTTON ) {
            await scope.propertyStats( );
        } else {
            scope.hideStats( );
        }
    }

    private async propertyStats( ) {

        let propertyId = 0;
        const scope = this;

        function nextProperty( ) {
            propertyId++;
            showProperty( );
        }

        function previousProperty( ) {
            propertyId--;
            showProperty( );
        }

        function showProperty( ) {
            propertyId = THREE.MathUtils.euclideanModulo( propertyId, scope.properties.length );
            scope.body.innerText = `${scope.properties[ propertyId ].getPropertyName( )} > Circle
Back > Square
Next Property > Triangle
Previous Property > X`;
        }

        async function onButtonPress( ) {
            const button = await scope.awaitButtonPress( [ O_BUTTON, X_BUTTON, TRIANGLE_BUTTON, SQUARE_BUTTON ] );
            if ( button == O_BUTTON ) {
                await scope.propertyFunctions( propertyId );
                return;
            } else if ( button == SQUARE_BUTTON ) {
                scope.baseStats( );
                return;
            } else if ( button == TRIANGLE_BUTTON ) {
                nextProperty( );
            } else if ( button == X_BUTTON ) {
                previousProperty( );
            }

            onButtonPress( );
        }

        scope.header.innerHTML = "Properties";
        onButtonPress( );
    }

    private propertyFunctions( id: number ): Promise < void > {
        const prop = this.properties[ id ],
            scope = this;
        return new Promise( ( resolve ) => {
            this.header.innerHTML = prop.getPropertyName( );
            this.body.innerText = `Add House > Circle
    Remove House > X
    ${prop.mortgaged ? "Unmortgage" : "Mortgage"} Property > Triangle
    Back > Square`;
            async function onButtonPress( ) {
                const button = await scope.awaitButtonPress( [ O_BUTTON, X_BUTTON, TRIANGLE_BUTTON, SQUARE_BUTTON ] );
                if ( button == O_BUTTON ) {
                    prop.addHouse( );
                } else if ( button == X_BUTTON ) {
                    prop.removeHouse( );
                } else if ( button == TRIANGLE_BUTTON ) {
                    prop.toggleMortgage( );
                } else {
                    scope.propertyStats( );
                    resolve( );
                    return;
                }

                new Promise( ( resolve ) => {
                    setTimeout( resolve, 500 );
                } ).then( ( ) => {
                    onButtonPress( );
                } )
            }

            onButtonPress( );
        } )
    }

    updateStats( ) {
        if ( this.money < 0 ) {
            Globals.players.splice( Globals.players.indexOf( this ), 1 );
        }
    }

    hideStats( ) {
        this.statsPanel.style.display = "none";
    }

    async showStats( ) {
        this.statsPanel.style.display = "block";
        await this.baseStats( );
    }

    goToPosition( position: number ): Promise < Player > {

        const currentT = tilePositions[ this.currentPos ];
        let intT = tilePositions[ position ];
        const scope = this;

        if ( intT < currentT ) {
            intT++;
            if ( !this.inJail ) this.money += 200;
        }

        const {
            camera,
            v0,
            v1,
            q0,
            q1,
            fromIObj,
            toIObj
        } = Globals;
        const p = new Promise < Player > ( ( resolve ) => {
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
            } ).delay( 500 ).easing( Easing.Quadratic.InOut ).onComplete( async ( ) => {
                await Globals.tiles[ scope.currentPos ].onLand( scope );
                resolve( scope )
            } );

            camToTokenTween.start( );
        } );

        return p;
    }

    moveForward( spaces: number ) {
        if ( this.inJail ) {
            if ( spaces >= 11 ) {
                this.inJail = false;
            } else if ( this.jailTurns == 5 ) {
                this.money -= 50;
                this.inJail = false;
            } else {
                const scope = this;
                this.jailTurns++;
                return new Promise < Player > ( ( resolve ) => {
                    resolve( scope )
                } );
            }
        }
        return this.goToPosition( THREE.MathUtils.euclideanModulo( this.currentPos + spaces, 40 ) );
    }

    moveBackward( spaces: number ) {
        return this.goToPosition( THREE.MathUtils.euclideanModulo( this.currentPos - spaces, 40 ) );
    }
}