import { Player } from "./Player";
import { Tile } from "./Tile";

export class Property implements Tile {
    type:"property";
    cost:number;
    mortgage:number;
    numHouses:number = 0;
    houseMortgage:number;
    rent:number;
    owner:Player;
    constructor(cost:number, rent:number){
        this.type = "property";
        this.rent = rent;
        this.cost = cost;
        this.owner = null;
    }

    onLand(player:Player):void{
        const scope = this;
        if(!this.owner){
            if(player.money >= this.cost){
                player.awaitButtonPress([0, 1]).then(button => {
                    if(button == 1){
                        player.money -= scope.cost;
                        scope.owner = player;
                        player.properties.push(scope);
                        player.propertyCount++;
                    }
                });
            }
        }else if(this.owner !== player){
            
        }
    }
}