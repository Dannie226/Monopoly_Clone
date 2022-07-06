import * as CANNON from "cannon-es";
import * as THREE from "three";
export class Dice {
    constructor(mesh, body) {
        this.mesh = mesh;
        this.body = body;
    }
    getMesh() {
        return this.mesh;
    }
    getFace() {
        const { upV: up, quatH: quat } = Dice;
        up.set(0, 1, 0);
        quat.copy(this.mesh.quaternion);
        quat.invert();
        up.applyQuaternion(quat);
        up.normalize();
        const ax = Math.abs(up.x), ay = Math.abs(up.y), az = Math.abs(up.z);
        const m = Math.max(ax, ay, az);
        if (m == ax) {
            return Number(up.x < 0) * 3 + 2;
        }
        else if (m == ay) {
            return Number(up.y > 0) * 5 + 1;
        }
        else {
            return Number(up.z < 0) + 3;
        }
    }
    update() {
        const { mesh, body } = this;
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    }
    roll() {
        const { mesh, body } = this;
        body.position.set(0, 50, 0);
        const linMult = 50, angMult = 75;
        body.velocity.set((Math.random() - 0.5) * linMult, Math.random() * linMult, (Math.random() - 0.5) * linMult);
        body.angularVelocity.set((Math.random() - 0.5) * angMult, (Math.random() - 0.5) * angMult, (Math.random() - 0.5) * angMult);
        mesh.position.set(0, 50, 0);
    }
    static init() {
        const world = new CANNON.World();
        world.gravity.set(0, -100, 0);
        world.defaultContactMaterial.friction = 10;
        world.defaultContactMaterial.restitution = 0.75;
        const size = 100;
        const size5 = size - 0.5;
        const body = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, size, 0)
        });
        body.addShape(new CANNON.Box(new CANNON.Vec3(size, 0.5, size)), new CANNON.Vec3(0, -size5, 0));
        body.addShape(new CANNON.Box(new CANNON.Vec3(size, 0.5, size)), new CANNON.Vec3(0, size5, 0));
        body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, size, size)), new CANNON.Vec3(-size5, 0, 0));
        body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, size, size)), new CANNON.Vec3(size5, 0, 0));
        body.addShape(new CANNON.Box(new CANNON.Vec3(size, size, 0.5)), new CANNON.Vec3(0, 0, -size5));
        body.addShape(new CANNON.Box(new CANNON.Vec3(size, size, 0.5)), new CANNON.Vec3(0, 0, size5));
        world.addBody(body);
        this.world = world;
    }
    static createDie(dieMesh) {
        if (!this.world)
            return;
        if (!this.dieMesh && !dieMesh) {
            throw "Must have input a die mesh for the first die creation";
        }
        else if (!this.dieMesh) {
            this.dieMesh = dieMesh;
        }
        const mesh = new THREE.Mesh(this.dieMesh.geometry, this.dieMesh.material);
        const body = new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3(20, 20, 20))
        });
        this.world.addBody(body);
        const die = new Dice(mesh, body);
        this.dice.push(die);
        return die;
    }
    static roll() {
        for (const die of this.dice) {
            die.roll();
        }
    }
    static update() {
        if (!this.world)
            return;
        this.world.step(1 / 60, this.clock.getDelta(), 4);
        for (const die of this.dice) {
            die.update();
        }
    }
    static getWorld() {
        return this.world;
    }
}
Dice.dice = [];
Dice.upV = new THREE.Vector3();
Dice.quatH = new THREE.Quaternion();
Dice.clock = new THREE.Clock();
