import { Property } from "./Property";

export class Player{
    public gamepad:Gamepad;
    public name:String;
    public money:number = 1500;
    public propertyCount:number = 0;
    public properties:Property[] = [];
    private statsPanel:HTMLDivElement = document.createElementNS("http://www.w3.org/1999/xhtml", "div") as HTMLDivElement;

    constructor(gamepad:Gamepad, name:String){
        this.gamepad = gamepad;
        this.name = name;
    }

    awaitButtonPress(allowedButtons:number[]):Promise<number>{
        const scope = this;
        const p = new Promise<number>((resolve, reject) => {
            const i = setInterval(() => {
                for(let i = 0; i < allowedButtons.length; i++){
                    if(scope.gamepad.buttons[allowedButtons[i]].pressed){
                        clearInterval(i);
                        resolve(allowedButtons[i]);
                    }
                }
            }, 1);
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