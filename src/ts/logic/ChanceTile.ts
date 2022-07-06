import { Tween } from "../../libs/tween";
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
            player.goToPosition(24);
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
            player.goToPosition(0);
        },
        immediate: true
    },
    advrr: {
        card: "Take a ride on the reading.\n If you pass go, collect $200",
        function( player: Player ) {
            player.goToPosition(5);
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
            player.goToPosition(39);
        },
        immediate: true
    },
    back: {
        card: "Go back 3 spaces",
        function( player: Player ) {
            player.inJail = true;
            player.moveBackward(3).then(() => {
                player.inJail = false;
            })
        },
        immediate: true
    },
    houses: {
        card: "Housing market crashes and burns.\n Lose $250",
        function( player: Player ) {
            player.money -= 250;
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
        card: "Go directly to jail.\n Do not pass go, do not collect $200",
        function( player: Player ) {
            player.inJail = true;
            player.goToPosition(10);
        },
        immediate: true
    },
    advnj: {
        card: "Get out of jail free",
        function( player: Player ) {
            player.inJail = false;
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
            player.goToPosition(11);
        },
        immediate: true
    },
    advrng:{
        card: "Go to a random spot on the board. If you pass go, collect $200.",
        function(player: Player){
            player.goToPosition(Math.random() * 40 | 0);
        },
        immediate:true
    }
}

export class ChanceTile implements Tile {
    type: "chance" = "chance";
    onLand( player: Player ): void {
        //choose card
        const k = Object.keys( cards );
        const card = cards[ k[ Math.random( ) * ( k.length - 1 ) | 0 ] ];

        const dCard = Card.card;
        if(!Card.added) Card.initDOM();
        dCard.innerText = card.card;
        dCard.style.display = "block";
        dCard.style.bottom = "-50px";
        dCard.style.transform = "translate(-50%, 0%)";
        new Tween({h:-50}).to({h:400}, 4500).onUpdate(({h}) => {
            dCard.style.bottom = h + "px";
        }).delay(2000).start().onComplete(() => {
            setTimeout(() => {
                dCard.style.display = "none";
            }, 3000);
        });
    }
}