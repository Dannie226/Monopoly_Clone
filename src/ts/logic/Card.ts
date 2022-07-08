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
        this.card.className = "card";
        this.added = true;
    }
}