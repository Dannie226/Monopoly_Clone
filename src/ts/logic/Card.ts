import {
    Player
} from "./Player";

export type useFunction = ( user: Player ) => Promise < void > ;

export class Card {
    public static readonly card: HTMLDivElement = document.createElementNS( "http://www.w3.org/1999/xhtml", "div" ) as HTMLDivElement;
    public static added: boolean = false;

    private constructor( ) {
        throw "Cannot construct a card";
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