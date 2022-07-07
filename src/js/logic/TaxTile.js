export class TaxTile {
    constructor(tax) {
        this.type = "special";
        this.tax = tax;
    }
    async onLand(player) {
        player.money -= this.tax;
    }
}
