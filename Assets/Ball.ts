import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { UnityEvent } from "UnityEngine.Events";
import { Transform, Vector3, Time, Rigidbody } from 'UnityEngine';


export default class Ball extends ZepetoScriptBehaviour {
    private mEvent: UnityEvent;
    public static stage: int;
    private speed: float;
    private angle: Vector3;
    private moving: bool;
    public rb: Rigidbody;


    Start() {
        this.mEvent = new UnityEvent();
        this.mEvent.AddListener(() => this.Shot());
    }

    Update() {
        if (this.moving)
        {
            this.rb.AddForce
        }
    }

    Shot() {


     }

}