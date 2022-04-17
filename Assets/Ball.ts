import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { UnityEvent } from "UnityEngine.Events";



export default class Ball extends ZepetoScriptBehaviour {
    private mEvent: UnityEvent;
    public static Stage: int;

    Start() {
        this.mEvent = new UnityEvent();
        this.mEvent.AddListener(() => this.Ping());
    }

    Ping() {


     }

}