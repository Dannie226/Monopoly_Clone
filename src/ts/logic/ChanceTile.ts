import {
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

const cards: {
    [ id: string ]: {
        card: string,
        function: useFunction,
        immediate: boolean
    }
} = {
    advil: {
        card: "Advance to Illinois Ave.",
        function( player: Player ) {
            //set player position to illinois avenue value
        },
        immediate: true
    },
    advut: {
        card: "Advance to nearest utility.\nIf unowned, you may buy from bank.\n If owned, reroll dice and pay owner 10 times the rolled amount.",
        function( player: Player ) {
            //set player position to nearest utility based on current position
        },
        immediate: true
    },
    chair: {
        card: "You have been elected chairman of the board. Pay each player $50",
        function( user: Player ) {
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
        function( player: Player ) {
            //set player position to be on go
        },
        immediate: true
    },
    advrr: {
        card: "Take a ride on the reading.\n If you pass go, collect $200",
        function( player: Player ) {
            //move to reading
        },
        immediate: true
    },
    loan: {
        card: "Your building and loan matures.\n Collect $150",
        function( player: Player ) {
            player.money += 150;
        },
        immediate: true
    },
    bank: {
        card: "Bank pays you dividend of $50",
        function( player: Player ) {
            player.money += 50;
        },
        immediate: true
    },
    advbw: {
        card: "Take a walk on the board walk.\nAdvance token to board walk.",
        function( player: Player ) {
            //move player to boardwalk
        },
        immediate: true
    },
    back: {
        card: "Go back 3 spaces",
        function( player: Player ) {
            //move player backward 3 spaces
        },
        immediate: true
    },
    houses: {
        card: "Make general repairs on all your properties.\n For each house, pay $25, for each hotel, pay $100.",
        function( player: Player ) {
            //loop through properties, and subtract 25 per house, and 100 per hotel
        },
        immediate: true
    },
    advnr: {
        card: "Advance token to the nearest railroad and pay owner twice the rental to which they are entitled.\nIf railroad is unowned, you may buy it from the bank",
        function( player: Player ) {

        },
        immediate: true
    },
    advjl: {
        card: "Go directly to jail.\n Do not pass gom do not collect $200",
        function( player: Player ) {

        },
        immediate: true
    },
    advnj: {
        card: "Get out of jail free",
        function( player: Player ) {

        },
        immediate: false
    },
    poor: {
        card: "Pay poor tax of $15",
        function( player: Player ) {
            player.money -= 15;
        },
        immediate: false
    },
    advsc: {
        card: "Advance to St. Charles Place.\nIf you pass go, collect $200",
        function( player: Player ) {

        },
        immediate: true
    }
}

export class ChanceTile implements Tile {
    type: "chance" = "chance";
    private static card: HTMLDivElement = document.createElementNS( "http://www.w3.org/1999/xhtml", "div" ) as HTMLDivElement;
    onLand( player: Player ): void {
        //choose card
        const k = Object.keys( cards );
        const card = cards[ k[ Math.random( ) * ( k.length - 1 ) | 0 ] ];

        //make camera look at chance card stack
        const dCard = ChanceTile.card;
        dCard.innerText = card.card;
        dCard.style.position = "absolute";
        dCard.style.transform = "translate(-50%, 0%)";
    }
}