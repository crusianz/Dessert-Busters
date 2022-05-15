import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class SampleScript extends ZepetoScriptBehaviour {

    speed: int;

    Start() {    
        console.log("Hello ZEPETO Script");
    }

    Update() {
        this.transform.Rotate(this.speed, 0, 0);
    }

}