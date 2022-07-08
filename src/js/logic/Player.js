import * as THREE from "three";
import { Easing, Tween } from "../../libs/tween";
import { Globals } from "./Globals";
const tilePositions = [
    0.000, .0333, .0570, .0810, .1046, .1280, .1530, .1767, .2010, .2245, .2550, .2830, .3070, .3300, .3550, .3800, .4030, .4260, .4510, .4750,
    .5000, .5333, .5570, .5815, .6047, .6290, .6520, .6765, .7000, .7240, .7540, .7820, .8065, .8310, .8550, .8795, .9030, .9265, .9505, .9750
];
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(625, 0, 600),
    new THREE.Vector3(600, 0, 625),
    new THREE.Vector3(-600, 0, 625),
    new THREE.Vector3(-625, 0, 600),
    new THREE.Vector3(-625, 0, -600),
    new THREE.Vector3(-600, 0, -625),
    new THREE.Vector3(600, 0, -625),
    new THREE.Vector3(625, 0, -600)
], true);
const v0 = new THREE.Vector3();
export class Player {
    constructor(id, name, token) {
        this.money = 1500;
        this.propertyCount = 0;
        this.properties = [];
        this.inJail = false;
        this.jailTurns = 0;
        this.chanceCard = null;
        this.communityChestCard = null;
        this.currentPos = 0;
        this.statsPanel = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
        this.gamepadId = id;
        this.name = name;
        this.statsPanel.className = "stats";
        this.token = token;
        curve.getPointAt(0, this.token.position);
        curve.getPointAt(0.01, v0);
        this.token.lookAt(v0);
    }
    getGamepad() {
        return navigator.getGamepads()[this.gamepadId];
    }
    awaitButtonPress(allowedButtons) {
        const scope = this;
        const p = new Promise((resolve, reject) => {
            const int = setInterval(() => {
                for (const button of allowedButtons) {
                    if (scope.getGamepad().buttons[button].pressed) {
                        clearInterval(int);
                        resolve(button);
                    }
                }
            }, 17);
        });
        return p;
    }
    awaitButtonPressFor(allowedButtons, timeoutMs) {
        const scope = this;
        const p = new Promise((resolve, reject) => {
            const i = setInterval(() => {
                for (const button of allowedButtons) {
                    if (scope.getGamepad().buttons[button].pressed) {
                        clearInterval(i);
                        clearTimeout(t);
                        resolve(button);
                    }
                }
            }, 17);
            const t = setTimeout(() => {
                clearInterval(i);
                clearTimeout(t);
                reject("Took Too long to press button");
            }, timeoutMs);
        });
        return p;
    }
    updateStats() {
    }
    hideStats() {
    }
    showStats() {
    }
    goToPosition(position) {
        const currentT = tilePositions[this.currentPos];
        let intT = tilePositions[position];
        const scope = this;
        if (intT < currentT) {
            intT++;
            if (!this.inJail)
                this.money += 200;
        }
        const { camera, v0, v1, q0, q1, fromIObj, toIObj } = Globals;
        const p = new Promise((resolve) => {
            v1.set(200, 100, 0);
            this.token.localToWorld(v1);
            v0.copy(camera.position);
            camera.lookAt(0, 0, 0);
            q0.copy(camera.quaternion);
            camera.position.copy(v1);
            camera.lookAt(this.token.position);
            q1.copy(camera.quaternion);
            fromIObj.a = 0;
            toIObj.a = 1;
            const camToTokenTween = new Tween(fromIObj).to(toIObj, 3000).onUpdate(({ a }) => {
                camera.position.lerpVectors(v0, v1, a);
                camera.quaternion.slerpQuaternions(q0, q1, a);
            }).onComplete(() => {
                fromIObj.a = currentT;
                toIObj.a = intT;
                scope.token.add(camera);
                camera.position.set(200, 100, 0);
                camera.lookAt(scope.token.position);
                tokenToSpaceTween.start();
            }).easing(Easing.Quadratic.InOut);
            const tokenToSpaceTween = new Tween(fromIObj).to(toIObj, Math.log2(Number(intT > 1) * 40 + position - scope.currentPos) * 1500).onUpdate(({ a }) => {
                curve.getPointAt(a % 1, scope.token.position);
                curve.getPointAt((a + 0.01) % 1, v0);
                scope.token.lookAt(v0);
            }).onComplete(() => {
                scope.currentPos = position;
                scope.token.remove(camera);
                scope.token.localToWorld(camera.position);
                v0.copy(camera.position);
                camera.lookAt(scope.token.position);
                q0.copy(camera.quaternion);
                v1.set(0, 975, 0);
                q1.set(-Math.SQRT1_2, 0, 0, Math.SQRT1_2);
                fromIObj.a = 0;
                toIObj.a = 1;
                camToOrigTween.start();
            }).delay(500).easing(Easing.Sinusoidal.InOut);
            const camToOrigTween = new Tween(fromIObj).to(toIObj, 3000).onUpdate(({ a }) => {
                camera.position.lerpVectors(v0, v1, a);
                camera.quaternion.slerpQuaternions(q0, q1, a);
            }).delay(500).easing(Easing.Quadratic.InOut).onComplete(async () => {
                await Globals.tiles[scope.currentPos].onLand(scope);
                resolve(scope);
            });
            camToTokenTween.start();
        });
        return p;
    }
    moveForward(spaces) {
        if (this.inJail) {
            if (spaces >= 11) {
                this.inJail = false;
            }
            else if (this.jailTurns == 5) {
                this.money -= 50;
                this.inJail = false;
            }
            else {
                const scope = this;
                this.jailTurns++;
                return new Promise((resolve) => {
                    resolve(scope);
                });
            }
        }
        return this.goToPosition(THREE.MathUtils.euclideanModulo(this.currentPos + spaces, 40));
    }
    moveBackward(spaces) {
        return this.goToPosition(THREE.MathUtils.euclideanModulo(this.currentPos - spaces, 40));
    }
}
