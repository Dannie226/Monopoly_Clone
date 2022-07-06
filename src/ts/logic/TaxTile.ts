import { Player } from "./Player";
import { Tile } from "./Tile";

export class TaxTile implements Tile {
    type:"special" = "special";
    private tax:number;
    constructor(tax:number){
        this.tax = tax;
    }

    onLand(player: Player): void {
        player.money -= this.tax;
    }
}