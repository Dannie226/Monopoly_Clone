export class GoToJail {
    constructor() {
        this.type = "special";
        this.jailed = null;
    }
    onLand(player) {
        if (this.jailed)
            this.jailed.inJail = false;
        this.jailed = player;
        player.inJail = true;
        player.goToPosition(10);
    }
}
