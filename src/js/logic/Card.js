export class Card {
    constructor(onUse) {
        this.use = onUse;
    }
    onUse(user) {
        this.use(user);
    }
}
