import {
    Player
} from "./Player";

export interface Tile {
    type: "property" | "chance" | "community chest" | "special";

    onLand( player: Player ): Promise < void > ;
}