export class GoTile {
    constructor() {
        this.type = "special";
    }
    onLand(player) {
        player.money += 100;
    }
}
