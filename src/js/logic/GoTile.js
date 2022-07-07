export class GoTile {
    constructor() {
        this.type = "special";
    }
    async onLand(player) {
        player.money += 100;
    }
}
