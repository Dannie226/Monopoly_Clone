export class TaxTile {
    constructor(tax) {
        this.type = "special";
        this.tax = tax;
    }
    onLand(player) {
        player.money -= this.tax;
    }
}
