import { Collider, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager';

export default class AddBall extends ZepetoScriptBehaviour {

    collider: Collider
    GM: GameManager

    Start() {    
        this.collider = this.gameObject.GetComponent<Collider>()
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        //this.GM.Down.AddListener(()=>this.Death())
    }

    Update(){
        if(this.transform.position.y < -8)
        this.Death
    }

    Death()
    {
        GameObject.Destroy(this.gameObject)
    }

    OnTriggerEnter(coll: Collider){
        if(coll.CompareTag("Ball")){
            this.collider.enabled = false
            this.Death()
        }
    }

}