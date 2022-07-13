import {
    Tween
} from "../../libs/tween";
import {
    Card,
    useFunction
} from "./Card";
import {
    Globals
} from "./Globals";
import {
    Player
} from "./Player";
import {
    Tile
} from "./Tile";

const cards = {
    advil: {
        card: "Advance to Illinois Ave.",
        async function( player: Player ) {
            await player.goToPosition( 24 );
        },
        immediate: true
    },
    advut: {
        card: "Advance to nearest utility.\nIf unowned, you may buy from bank.\n If owned, reroll dice and pay owner 10 times the rolled amount.",
        async function( player: Player ) {
            //set player position to nearest utility based on current position
        },
        immediate: true
    },
    chair: {
        card: "You have been elected chairman of the board. Pay each player $50",
        async function( user: Player ) {
            const players = Globals.players;
            user.money -= 50 * players.length - 1;
            for ( const player of players ) {
                if ( player !== user ) player.money += 50;
            }
        },
        immediate: true
    },
    advgo: {
        card: "Advance to go",
        async function( player: Player ) {
            await player.goToPosition( 0 );
        },
        immediate: true
    },
    advrr: {
        card: "Take a ride on the reading.\n If you pass go, collect $200",
        async function( player: Player ) {
            await player.goToPosition( 5 );
        },
        immediate: true
    },
    loan: {
        card: "Your building and loan matures.\n Collect $150",
        async function( player: Player ) {
            player.money += 150;
        },
        immediate: true
    },
    bank: {
        card: "Bank pays you dividend of $50",
        async function( player: Player ) {
            player.money += 50;
        },
        immediate: true
    },
    advbw: {
        card: "Take a walk on the board walk.\nAdvance token to board walk.",
        async function( player: Player ) {
            await player.goToPosition( 39 );
        },
        immediate: true
    },
    back: {
        card: "Go back 3 spaces",
        async function( player: Player ) {
            player.inJail = true;
            await player.moveBackward( 3 );
            player.inJail = false;
        },
        immediate: true
    },
    houses: {
        card: "Because one of your houses wasn't up to code, the roof collapsed and killed someone.\n Go to jail. Go directly to jail, do not pass go, do not collect $200",
        async function( player: Player ) {
            player.inJail = true;
            player.jailTurns = 1;
            await player.goToPosition( 10 );
        },
        immediate: true
    },
    advnr: {
        card: "Advance token to the nearest railroad and pay owner twice the rental to which they are entitled.\nIf railroad is unowned, you may buy it from the bank",
        async function( player: Player ) {

        },
        immediate: true
    },
    advjl: {
        card: "Go directly to jail.\n Do not pass go, do not collect $200",
        async function( player: Player ) {
            player.inJail = true;
            player.jailTurns = 1;
            await player.goToPosition( 10 );
        },
        immediate: true
    },
    advnj: {
        card: "Get out of jail free",
        async function( player: Player ) {
            player.inJail = false;
        },
        immediate: false
    },
    poor: {
        card: "Pay poor tax of $15",
        async function( player: Player ) {
            player.money -= 15;
        },
        immediate: false
    },
    advsc: {
        card: "Advance to St. Charles Place.\nIf you pass go, collect $200",
        async function( player: Player ) {
            await player.goToPosition( 11 );
        },
        immediate: true
    },
    advrng: {
        card: "Go to a random spot on the board. If you pass go, collect $200.",
        async function( player: Player ) {
            await player.goToPosition( Math.random( ) * 40 | 0 );
        },
        immediate: true
    },
    bots: {
        card: "You were found to be betting on bot fights.\n Go to jail, go directly to jail, do not pass go, do not collect $200",
        async function( player: Player ) {
            player.inJail = true;
            player.jailTurns = 1;
            await player.goToPosition( 10 );
        }
    }
}

export class ChanceTile implements Tile {
    type: "chance" = "chance";
    onLand( player: Player ): Promise < void > {
        return new Promise( ( resolve ) => {
            //choose card
            const k = Object.keys( cards );
            const card = cards[ k[ Math.random( ) * ( k.length - 1 ) | 0 ] ];

            const dCard = Card.card;
            if ( !Card.added ) Card.initDOM( );
            dCard.innerText = card.card;
            dCard.style.display = "block";
            dCard.style.bottom = "-50px";
            dCard.style.transform = "translate(-50%, 0%)";
            new Tween( {
                h: -50
            } ).to( {
                h: 400
            }, 4500 ).onUpdate( ( {
                h
            } ) => {
                dCard.style.bottom = h + "px";
            } ).delay( 2000 ).start( ).onComplete( ( ) => {
                setTimeout( ( ) => {
                    dCard.style.display = "none";
                    card.function( player ).then( resolve );
                }, 3000 );
            } );
        } );
    }
}