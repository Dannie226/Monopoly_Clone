import {
    Player
} from "./Player";
import {
    Tile
} from "./Tile";

export class GoTile implements Tile {
    type: "special" = "special";

    async onLand( player: Player ) {
        player.money += 100;
    }
}