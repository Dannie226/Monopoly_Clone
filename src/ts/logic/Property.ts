import * as THREE from "three";
import {
    Easing,
    Tween
} from "../../libs/tween";
import {
    A_BUTTON,
    B_BUTTON,
    X_BUTTON
} from "./Buttons";
import {
    Globals
} from "./Globals";
import {
    Player
} from "./Player";
import {
    Tile
} from "./Tile";

const properties = [
    "Mediterranean Avenue", "Baltic Avenue", "Reading Railroad", "Oriental Avenue",
    "Vermont Avenue", "Connecticut Avenue", "St. Charles Place", "Electric Company",
    "States Avenue", "Virginia Avenue", "Pennsylvania Railroad", "St. James Place",
    "Tennessee Avenue", "New York Avenue", "Kentucky Avenue", "Indiana Avenue",
    "Illinois Avenue", "B. & O. Railroad", "Atlantic Avenue","Vetnor Avenue", 
    "Water Works", "Marvins Gardens", "Pacific Avenue", "North Carolina Avenue",
    "Pennsylvania Avenue", "Short Line", "Park Place", "Boardwalk"
];

properties.length

type CostTable = {
    rents: [ number, number, number, number, number ],
    cost: number,
    houseCost: number,
    mortgage: number,
    houseMortgage: number
}

export class Property implements Tile {
    private static readonly HOUSE_WIDTH = 28;
    private static PROPERTY_COUNT = 0;
    type: "property";
    numHouses: number = 0;
    mortgaged: boolean = false;
    owner: Player;
    table: CostTable;
    initHousePos: THREE.Vector3;
    axis: "x" | "z";
    private instanceId: number;
    constructor( cost: number, rent: number, houseCost: number, houseRents: [ number, number, number, number ], axis: "x" | "z", value: number, direction: -1 | 1 ) {
        this.type = "property";
        this.owner = null;
        this.table = {
            cost,
            houseCost,
            rents: [ rent, ...houseRents ],
            mortgage: cost / 2,
            houseMortgage: houseCost / 2
        };

        this.initHousePos = new THREE.Vector3;
        this.initHousePos[ axis ] = value;
        this.initHousePos[ axis == "z" ? "x" : "z" ] = 560 * direction;
        this.axis = axis;
        this.instanceId = ( Property.PROPERTY_COUNT++ ) * 4;
    }

    async onLand( player: Player ) {
        const scope = this;
        if ( !this.owner ) {
            if ( player.money >= this.table.cost ) {
                player.awaitButtonPress( [ B_BUTTON, A_BUTTON ] ).then( button => {
                    if ( button == A_BUTTON ) {
                        player.money -= scope.table.cost;
                        scope.owner = player;
                        player.properties.push( scope );
                        player.propertyCount++;
                    }
                } );
            }
        } else if ( this.owner !== player ) {
            if ( this.owner.inJail || this.mortgaged ) return;
            this.owner.awaitButtonPressFor( [ X_BUTTON ], 20000 ).then( ( ) => {
                player.money -= scope.table.rents[ scope.numHouses ];
                scope.owner.money += scope.table.rents[ scope.numHouses ];
            } ).catch( ( ) => {
                console.log( scope.owner.name + " Forgot to collect on their rent" );
            } );
        }
    }

    mortgage( ): void {
        this.mortgaged = true;
        this.owner.money += this.table.mortgage;
    }

    unmortgage( ): void {
        const unmortgageCost = this.table.cost * 1.1;
        if ( this.owner.money >= unmortgageCost ) {
            this.owner.money -= unmortgageCost;
            this.mortgaged = false;
        }
    }

    toggleMortgage(): void {
        if(this.mortgaged){
            this.unmortgage();
        }else{
            this.mortgage();
        }
    }

    getPropertyName() {
        return properties[this.instanceId / 4];
    }

    addHouse( ): Promise < void > {
        const scope = this;
        return new Promise( ( resolve, reject ) => {
            if ( scope.numHouses === 4 ) {
                resolve( );
                return;
            }

            if ( scope.owner.money >= scope.table.houseCost ) {
                scope.owner.money -= scope.table.houseCost;
                const {
                    fromIObj,
                    toIObj,
                    houseMesh
                } = Globals;
                const v0 = new THREE.Vector3,
                    v1 = new THREE.Vector3,
                    q0 = new THREE.Quaternion( ),
                    q1 = new THREE.Quaternion( );
                const p = new THREE.Vector3,
                    s = new THREE.Vector3( 1, 1, 1 ),
                    q = new THREE.Quaternion,
                    m = new THREE.Matrix4;
                const i = scope.instanceId + scope.numHouses;

                fromIObj.a = 0;
                toIObj.a = 1;
                v1.copy( scope.initHousePos );
                v1[ scope.axis ] -= Property.HOUSE_WIDTH * scope.numHouses;
                scope.numHouses++;

                v0.copy( v1 );
                v0.negate( );
                v0.setLength( 2000 );
                q0.set( 0, 0, 0, 1 );
                if ( scope.axis == "x" ) {
                    q1.set( 0, 0, 0, 1 );
                } else {
                    q1.set( 0, Math.SQRT1_2, 0, Math.SQRT1_2 );
                }
                new Tween( fromIObj ).to( toIObj, 7000 ).onUpdate( ( {
                    a
                } ) => {
                    p.lerpVectors( v0, v1, a );
                    q.slerpQuaternions( q0, q1, a );

                    m.compose( p, q, s );
                    houseMesh.setMatrixAt( i, m );
                    houseMesh.instanceMatrix.needsUpdate = true;
                } ).onComplete( ( ) => {
                    resolve( )
                } ).easing( Easing.Bounce.Out ).start( );
            } else {
                resolve( );
            }
        } );
    }

    removeHouse( ): Promise < void > {
        const scope = this;
        return new Promise( ( resolve ) => {
            if ( scope.numHouses === 0 ) {
                resolve( );
                return;
            }
            scope.owner.money += scope.table.houseMortgage;
            const {
                fromIObj,
                toIObj,
                houseMesh
            } = Globals;
            const v0 = new THREE.Vector3,
                v1 = new THREE.Vector3,
                q0 = new THREE.Quaternion( ),
                q1 = new THREE.Quaternion( );
            const p = new THREE.Vector3,
                s = new THREE.Vector3( 1, 1, 1 ),
                q = new THREE.Quaternion,
                m = new THREE.Matrix4;

            scope.numHouses--;
            const i = scope.instanceId + scope.numHouses;

            houseMesh.getMatrixAt( i, m );

            v0.setFromMatrixPosition( m );
            v1.copy( v0 );
            v1.negate( );
            v1.setLength( 2000 );

            q0.setFromRotationMatrix( m );
            q1.set( 0, 0, 0, 1 );

            fromIObj.a = 0;
            toIObj.a = 1;
            new Tween( fromIObj ).to( toIObj, 7000 ).onUpdate( ( {
                a
            } ) => {
                p.lerpVectors( v0, v1, a );
                q.slerpQuaternions( q0, q1, a );

                m.compose( p, q, s );
                houseMesh.setMatrixAt( i, m );
                houseMesh.instanceMatrix.needsUpdate = true;
            } ).onComplete( ( ) => {
                m.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );
                houseMesh.setMatrixAt( i, m );
                houseMesh.instanceMatrix.needsUpdate = true;
                resolve( );
            } ).easing( Easing.Bounce.In ).start( );
        } )
    }
}