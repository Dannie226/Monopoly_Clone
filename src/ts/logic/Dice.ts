import Ammo from "ammojs-typed";
import THREE from "three";
Ammo();

export class Dice {
    private static world:Ammo.btDiscreteDynamicsWorld;
    private static dice:Dice[];
    private static upV:THREE.Vector3 = new THREE.Vector3();
    private static quatH:THREE.Quaternion = new THREE.Quaternion();

    private mesh:THREE.Mesh;
    private body:Ammo.btRigidBody;

    private constructor(mesh:THREE.Mesh, body:Ammo.btRigidBody){
        this.mesh = mesh;
        this.body = body;
    }

    public getFace(){
        const {upV:up, quatH:quat} = Dice;

        up.set(0, 1, 0);
        quat.copy(this.mesh.quaternion);
        quat.invert();

        up.applyQuaternion(quat);
        up.normalize();

        const ax = Math.abs(up.x), ay = Math.abs(up.y), az = Math.abs(up.z);
        const m = Math.max(ax, ay, az);

        if(m == ax){
            return Number(up.x < 0) * 3 + 2;
        }else if(m == ay){
            return Number(up.y > 0) * 5 + 1;
        }else{
            return Number(up.z < 0) + 3;
        }
    }
}