import * as THREE from "three";
import {
    A_BUTTON,
    B_BUTTON,
    X_BUTTON
} from "./Buttons";
import {
    Player
} from "./Player";
import {
    Tile
} from "./Tile";

type CostTable = {
    rent:number,
    houseRents:[number, number, number, number],
    cost:number,
    houseCost:number,
    mortgage:number,
    houseMortgage:number
}

export class Property implements Tile {
    type: "property";
    numHouses: number = 0;
    mortaged: boolean = false;
    owner: Player;
    table:CostTable;
    constructor( cost: number, rent: number, houseCost:number, houseRents:[number, number, number, number] ) {
        this.type = "property";
        this.owner = null;
        this.table = {
            cost,
            rent,
            houseCost,
            houseRents,
            mortgage:cost / 2,
            houseMortgage:houseCost / 2
        };
    }

    async onLand( player: Player ) {
        const scope = this;
        if ( !this.owner ) {
            if ( player.money >= this.table.cost ) {
                player.awaitButtonPress( [ B_BUTTON, A_BUTTON ] ).then( button => {
                    if ( button == 1 ) {
                        player.money -= scope.table.cost;
                        scope.owner = player;
                        player.properties.push( scope );
                        player.propertyCount++;
                    }
                } );
            }
        } else if ( this.owner !== player ) {
            if ( this.owner.inJail ) return;
            this.owner.awaitButtonPressFor( [ X_BUTTON ], 20000 ).then( ( ) => {
                player.money -= scope.table.rent;
                scope.owner.money += scope.table.rent;
            } ).catch( ( ) => {
                console.log( scope.owner.name + " Forgot to collect on their rent" );
            } );
        }
    }
}