import {
    Player
} from "./Player";
import {
    Tile
} from "./Tile";

export class GoToJail implements Tile {
    type: "special" = "special";
    jailed: Player = null;

    onLand( player: Player ): void {
        if ( this.jailed ) this.jailed.inJail = false;
        this.jailed = player;
        player.inJail = true;
        player.goToPosition(10);
    }
}