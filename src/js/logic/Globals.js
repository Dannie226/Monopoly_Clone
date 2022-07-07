import { ChanceTile } from "./ChanceTile";
import { CommunityChest } from "./CommunityChest";
import { FreeParking } from "./FreeParking";
import { GoTile } from "./GoTile";
import { GoToJail } from "./GoToJail";
import { Property } from "./Property";
import { TaxTile } from "./TaxTile";
import * as THREE from "three";
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
    new Property(100, 6),
    new ChanceTile(),
    new Property(100, 6),
    new Property(120, 8),
    new FreeParking(),
    new Property(140, 10),
    new Property(150, 75),
    new Property(140, 10),
    new Property(160, 12),
    new Property(200, 75),
    new Property(180, 14),
    new Property(180, 14),
    new CommunityChest(),
    new Property(100, 16),
    new FreeParking(),
    new Property(220, 18),
    new ChanceTile(),
    new Property(220, 18),
    new Property(240, 20),
    new Property(200, 125),
    new Property(260, 22),
    new Property(260, 22),
    new Property(150, 75),
    new Property(280, 24),
    new GoToJail(),
    new Property(300, 26),
    new Property(300, 26),
    new CommunityChest(),
    new Property(320, 28),
    new Property(200, 200),
    new ChanceTile(),
    new Property(350, 35),
    new TaxTile(75),
    new Property(400, 50)
];
Globals.v0 = new THREE.Vector3();
Globals.v1 = new THREE.Vector3();
Globals.q0 = new THREE.Quaternion();
Globals.q1 = new THREE.Quaternion();
Globals.fromIObj = {
    a: 0
};
Globals.toIObj = {
    a: 1
};
