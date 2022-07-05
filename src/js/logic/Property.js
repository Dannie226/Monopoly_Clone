import { A_BUTTON, B_BUTTON, X_BUTTON } from "./Buttons";
export class Property {
    constructor(cost, rent) {
        this.numHouses = 0;
        this.mortaged = false;
        this.type = "property";
        this.rent = rent;
        this.cost = cost;
        this.owner = null;
    }
    onLand(player) {
        const scope = this;
        if (!this.owner) {
            if (player.money >= this.cost) {
                player.awaitButtonPress([B_BUTTON, A_BUTTON]).then(button => {
                    if (button == 1) {
                        player.money -= scope.cost;
                        scope.owner = player;
                        player.properties.push(scope);
                        player.propertyCount++;
                    }
                });
            }
        }
        else if (this.owner !== player) {
            if (this.owner.inJail)
                return;
            this.owner.awaitButtonPressFor([X_BUTTON], 20000).then(() => {
                player.money -= scope.rent;
                scope.owner.money += scope.rent;
            }).catch(() => {
                console.log(scope.owner.name + " Forgot to collect on their rent");
            });
        }
    }
}
