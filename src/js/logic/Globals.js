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
    new Property(60, 2, 50, [10, 30, 90, 160], "x", 517, 1),
    new CommunityChest(),
    new Property(60, 4, 50, [20, 60, 180, 320], "x", 280, 1),
    new TaxTile(200),
    new Property(200, 50, 0, [50, 50, 50, 50], "x", 45, 1),
    new Property(100, 6, 50, [30, 90, 270, 400], "x", -77, 1),
    new ChanceTile(),
    new Property(100, 6, 50, [30, 90, 270, 400], "x", -312, 1),
    new Property(120, 8, 50, [40, 100, 300, 450], "x", -430, 1),
    new FreeParking(),
    new Property(140, 10, 100, [50, 150, 450, 625], "z", 517, -1),
    new Property(150, 75, 0, [75, 75, 75, 75], "z", 400, -1),
    new Property(140, 10, 100, [50, 150, 450, 625], "z", 280, -1),
    new Property(160, 12, 100, [60, 180, 500, 700], "z", 160, -1),
    new Property(200, 75, 0, [75, 75, 75, 75], "z", 44, -1),
    new Property(180, 14, 100, [70, 200, 550, 750], "z", -77, -1),
    new CommunityChest(),
    new Property(180, 14, 100, [70, 200, 550, 750], "z", -314, -1),
    new Property(100, 16, 100, [80, 220, 600, 800], "z", -432, -1),
    new FreeParking(),
    new Property(220, 18, 150, [90, 250, 700, 875], "x", -430, -1),
    new ChanceTile(),
    new Property(220, 18, 150, [90, 250, 700, 875], "x", -195, -1),
    new Property(240, 20, 150, [100, 300, 750, 925], "x", -77, -1),
    new Property(200, 125, 0, [125, 125, 125, 125], "x", 45, -1),
    new Property(260, 22, 150, [110, 330, 800, 975], "x", 162, -1),
    new Property(260, 22, 150, [110, 30, 800, 975], "x", 280, -1),
    new Property(150, 75, 0, [75, 75, 75, 75], "x", 398, -1),
    new Property(280, 24, 150, [120, 360, 850, 1025], "x", 517, -1),
    new GoToJail(),
    new Property(300, 26, 200, [130, 390, 900, 1100], "z", -432, 1),
    new Property(300, 26, 200, [130, 390, 900, 1100], "z", -314, 1),
    new CommunityChest(),
    new Property(320, 28, 200, [150, 450, 1000, 1200], "z", -77, 1),
    new Property(200, 200, 0, [200, 200, 200, 200], "z", 44, 1),
    new ChanceTile(),
    new Property(350, 35, 200, [175, 500, 1100, 1300], "z", 280, 1),
    new TaxTile(75),
    new Property(400, 50, 200, [200, 600, 1400, 1700], "z", 517, 1)
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
