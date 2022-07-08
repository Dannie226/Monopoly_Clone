export class Card {
    constructor() {
        throw "Cannot construct a card";
    }
    static initDOM() {
        document.body.appendChild(this.card);
        this.card.className = "card";
        this.added = true;
    }
}
Card.card = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
Card.added = false;
