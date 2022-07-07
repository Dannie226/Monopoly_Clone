export class Card {
    constructor() {
        throw "Cannot construct a card";
    }
    static initDOM() {
        document.body.appendChild(this.card);
        this.card.style.padding = "5px";
        this.card.style.fontSize = "25px";
        this.card.style.position = "absolute";
        this.card.style.backgroundColor = "white";
        this.card.style.left = "50%";
        this.card.style.display = "none";
        this.added = true;
    }
}
Card.card = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
Card.added = false;
