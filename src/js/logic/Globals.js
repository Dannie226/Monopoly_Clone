import { CommunityChest } from "./CommunityChest";
import { GoTile } from "./GoTile";
import { Property } from "./Property";
import { TaxTile } from "./TaxTile";
export class Globals {
    constructor() {
        throw "Cannot create a Globals instance";
    }
}
Globals.players = [];
Globals.tiles = [
    new GoTile(),
    new Property(60, 4),
    new CommunityChest(),
    new Property(60, 2),
    new TaxTile(200),
    new Property(200, 50),
    new Property(100, 6)
];
