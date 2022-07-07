import {
    ChanceTile
} from "./ChanceTile";
import {
    CommunityChest
} from "./CommunityChest";
import {
    FreeParking
} from "./FreeParking";
import {
    GoTile
} from "./GoTile";
import {
    GoToJail
} from "./GoToJail";
import {
    Player
} from "./Player";
import {
    Property
} from "./Property";
import {
    TaxTile
} from "./TaxTile";
import {
    Tile
} from "./Tile";

import * as THREE from "three";

export class Globals {
    private constructor( ) {
        throw "Cannot create a Globals instance";
    }

    public static players: Player[ ] = [ ];

    public static camera: THREE.Camera;

    public static tiles: Tile[ ] = [
        new GoTile( ),
        new Property( 60, 2, 50, [10, 30, 90, 160] ),
        new CommunityChest( ),
        new Property( 60, 4, 50, [20, 60, 180, 320] ),
        new TaxTile( 200 ),
        new Property( 200, 50, 0, [50, 50, 50, 50] ),
        new Property( 100, 6, 50, [30, 90, 270, 400] ),
        new ChanceTile( ),
        new Property( 100, 6, 50, [30, 90, 270, 400] ),
        new Property( 120, 8, 50, [40, 100, 300, 450] ),
        new FreeParking( ),
        new Property( 140, 10, 100, [50, 150, 450, 625] ),
        new Property( 150, 75, 0, [75, 75, 75, 75] ),
        new Property( 140, 10, 100, [50, 150, 450, 625] ),
        new Property( 160, 12, 100, [60, 180, 500, 700] ),
        new Property( 200, 75, 0, [75, 75, 75, 75] ),
        new Property( 180, 14, 100, [70, 200, 550, 750] ),
        new Property( 180, 14, 100, [70, 200, 550, 750] ),
        new CommunityChest( ),
        new Property( 100, 16, 100, [80, 220, 600, 800] ),
        new FreeParking( ),
        new Property( 220, 18, 150, [90, 250, 700, 875] ),
        new ChanceTile( ),
        new Property( 220, 18, 150, [90, 250, 700, 875] ),
        new Property( 240, 20, 150, [100, 300, 750, 925] ),
        new Property( 200, 125, 0, [125, 125, 125, 125] ),
        new Property( 260, 22, 150, [110, 330, 800, 975] ),
        new Property( 260, 22, 150, [110, 30, 800, 975] ),
        new Property( 150, 75, 0, [75, 75, 75, 75] ),
        new Property( 280, 24, 150, [120, 360, 850, 1025] ),
        new GoToJail( ),
        new Property( 300, 26, 200, [130, 390, 900, 1100] ),
        new Property( 300, 26, 200, [130, 390, 900, 1100] ),
        new CommunityChest( ),
        new Property( 320, 28, 200, [150, 450, 1000, 1200] ),
        new Property( 200, 200, 0, [200, 200, 200, 200] ),
        new ChanceTile( ),
        new Property( 350, 35, 200, [175, 500, 1100, 1300] ),
        new TaxTile( 75 ),
        new Property( 400, 50, 200, [200, 600, 1400, 1700] )
    ]

    public static v0 = new THREE.Vector3( );
    public static v1 = new THREE.Vector3( );
    public static q0 = new THREE.Quaternion( );
    public static q1 = new THREE.Quaternion( );
    public static fromIObj = {
        a: 0
    };
    public static toIObj = {
        a: 1
    }
}