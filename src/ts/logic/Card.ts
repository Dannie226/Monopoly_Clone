import {
    Player
} from "./Player";

export type useFunction = ( user: Player ) => void;

export class Card {
    public static readonly card: HTMLDivElement = document.createElementNS( "http://www.w3.org/1999/xhtml", "div" ) as HTMLDivElement;
    public static added: boolean = false;

    private use: useFunction;

    constructor( onUse: useFunction ) {
        this.use = onUse;
    }

    onUse( user: Player ) {
        this.use( user );
    }

    static initDOM( ) {
        document.body.appendChild( this.card );
        this.card.style.padding = "5px";
        this.card.style.fontSize = "25px";
        this.card.style.position = "absolute";
        this.card.style.backgroundColor = "white";
        this.card.style.left = "50%";
        this.card.style.display = "none";
        this.added = true;
    }
}