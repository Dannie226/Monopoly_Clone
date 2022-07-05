import {
    Player
} from "./Player";

export class Globals {
    private constructor( ) {
        throw "Cannot create a Globals instance";
    }

    public static players: Player[ ] = [ ];

    public static camera: THREE.Camera;
}