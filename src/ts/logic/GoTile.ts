import {
    Player
} from "./Player";
import {
    Tile
} from "./Tile";

export class GoTile implements Tile {
    type: "special" = "special";

    onLand( player: Player ): void {
        player.money += 100;
    }
}