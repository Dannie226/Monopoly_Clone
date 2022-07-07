import {
    Player
} from "./Player";
import {
    Tile
} from "./Tile";

export class GoToJail implements Tile {
    type: "special" = "special";
    jailed: Player = null;

    async onLand( player: Player ) {
        if ( this.jailed ) this.jailed.inJail = false;
        this.jailed = player;
        player.inJail = true;
        await player.goToPosition( 10 );
    }
}