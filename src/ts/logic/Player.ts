import { Card } from "./Card";
import { Property } from "./Property";

export class Player{
    public gamepad:Gamepad;
    public name:String;
    public money:number = 1500;
    public propertyCount:number = 0;
    public properties:Property[] = [];
    public inJail:boolean = false;
    public chanceCard:Card = null;
    public communityChestCard:Card = null;
    private statsPanel:HTMLDivElement = document.createElementNS("http://www.w3.org/1999/xhtml", "div") as HTMLDivElement;

    constructor(gamepad:Gamepad, name:String){
        this.gamepad = gamepad;
        this.name = name;
    }

    awaitButtonPress(allowedButtons:number[]):Promise<number>{
        const scope = this;
        const p = new Promise<number>((resolve, reject) => {
            const int = setInterval(() => {
                for(let i = 0; i < allowedButtons.length; i++){
                    if(scope.gamepad.buttons[allowedButtons[i]].pressed){
                        clearInterval(int);
                        resolve(allowedButtons[i]);
                    }
                }
            }, 1);
        });
        return p;
    }

    awaitButtonPressFor(allowedButtons:number[], timeoutMs:number):Promise<number>{
        const scope = this;
        const p = new Promise<number>((resolve, reject) => {
            const int = setInterval(() => {
                for(let i = 0; i < allowedButtons.length; i++){
                    if(scope.gamepad.buttons[allowedButtons[i]].pressed){
                        clearInterval(int);
                        clearTimeout(t);
                        resolve(allowedButtons[i]);
                    }
                }
            }, 1);

            const t = setTimeout(() => {
                clearInterval(int);
                clearTimeout(t);
                reject("Took Too long to collect rent");
            }, timeoutMs);
        });
        return p;
    }

    updateStats(){

    }

    hideStats(){

    }

    showStats(){

    }
}