export class GoToJail {
    constructor() {
        this.type = "special";
        this.jailed = null;
    }
    async onLand(player) {
        if (this.jailed)
            this.jailed.inJail = false;
        this.jailed = player;
        player.jailTurns = 1;
        player.inJail = true;
        await player.goToPosition(10);
    }
}
