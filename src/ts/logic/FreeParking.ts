import {
    Player
} from "./Player";
import {
    Tile
} from "./Tile";

export class FreeParking implements Tile {
    type: "special" = "special";

    onLand( player: Player ): void {

    }
}