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
    advnj: {
        card: "Get out of jail, free.",
        async function( player: Player ) {
            player.inJail = false;
        },
        immediate: false
    },
    life: {
        card: "Life insurance matures.\n Collect $100.",
        async function( player: Player ) {
            player.money += 100;
        },
        immediate: true
    },
    stock: {
        card: "From sale of stock, you get $45.",
        async function( player: Player ) {
            player.money += 45;
        },
        immediate: true
    },
    belle: {
        card: "You lost horribly in a beauty contest.\n Pay $50 for entrance fee.",
        async function( player: Player ) {
            player.money -= 50;
        },
        immediate: true
    },
    xmas: {
        card: "You were found stealing toys from children on X-mas.\n Pay $100 for compensation.",
        async function( player: Player ) {
            player.money -= 100;
        },
        immediate: true
    },
    tax: {
        card: "You were convicted of tax evasion.\n Go to jail, go directly to jail, do not pass go, do not collect $200.",
        async function( player: Player ) {
            player.inJail = true;
            player.jailTurns = 1;
            player.goToPosition( 10 );
        },
        immediate: true
    },
    opera: {
        card: "Grand Opera Opening.\n Collect $50 from every player.",
        async function( player: Player ) {
            const players = Globals.players;
            for ( const opp of players ) {
                opp.money -= 50;
                player.money += 50;
            }
        },
        immediate: true
    },
    hosp: {
        card: "You broke your ankle. Pay hospital bill of $150.",
        async function( player: Player ) {
            player.money -= 150;
        },
        immediate: true
    },
    school: {
        card: "You bought books for a student. Pay $10.",
        async function( player: Player ) {
            player.money -= 10;
        },
        immediate: true
    },
    repairs: {
        card: "Housing market soars.\n Collect $100.",
        async function( player: Player ) {
            player.money += 100;
        },
        immediate: true
    },
    bank: {
        card: "Bank error really in your favor. Collect $350",
        async function( player: Player ) {
            player.money += 350;
        },
        immediate: true
    },
    marriage: {
        card: "You got married and then robbed blind.\n You lose $400",
        async function( player: Player ) {
            player.money -= 400;
        },
        immediate: true
    },
    inherit: {
        card: "You inherit $500",
        async function( player: Player ) {
            player.money += 500;
        },
        immediate: true
    },
    advjl: {
        card: "Go to jail. Go directly to jail.\n Do not pass go, do not collect $200",
        async function( player: Player ) {
            player.inJail = true;
            player.jailTurns = 1;
            player.goToPosition( 10 );
        },
        immediate: true
    },
    jackpot: {
        card: "You got a lottery ticket.\n You have a 1 / 1000 chance that you win $1000, otherwise, you lose $10",
        async function( player: Player ) {
            player.money += Number( ( Math.random( ) * 1000 | 0 ) == 234 ) * 1000;
        },
        immediate: true
    }
}

export class CommunityChest implements Tile {
    type: "community chest" = "community chest";

    onLand( player: Player ): Promise < void > {
        return new Promise( ( resolve ) => {
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
                }, 3000 );
            } );
        } );
    }
}