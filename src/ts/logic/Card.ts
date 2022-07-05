import {
    Player
} from "./Player";

export type useFunction = ( user: Player ) => void;

export class Card {
    private use: useFunction;

    constructor( onUse: useFunction ) {
        this.use = onUse;
    }

    onUse( user: Player ) {
        this.use( user );
    }
}