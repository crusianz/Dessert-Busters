import { Compute_DistanceTransform_EventTypes } from 'TMPro'
import { Animator, Collider, Collision, GameObject, BoxCollider, Mathf } from 'UnityEngine'
import { UnityEvent } from 'UnityEngine.Events';
import {Text} from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'

export default class Block extends ZepetoScriptBehaviour {

    public hp_t: Text
    
    public type: int
    hp: int
    GM: GameManager
    anim: Animator
    col: BoxCollider

    Start() {    
        this.anim = this.gameObject.GetComponent<Animator>()
        this.col = this.GetComponent<BoxCollider>()
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.hp_t = this.gameObject.GetComponentInChildren<Text>()
        if(this.type >= 1) this.hp = Mathf.RoundToInt(this.GM.layer * 2.5)
        else this.hp = this.GM.layer
    }

    Update()
    {
        if(this.hp <= 0)
        {
            this.col.enabled = false    
        }
        else this.col.enabled = true
        this.hp_t.text = String(this.hp)
    }

    public Death()
    {
        if(this.hp <= 0) {
            this.GM.ScoreUp.Invoke(0)
            GameObject.Destroy(this.gameObject)
        }
    }

    OnTriggerEnter(coll: Collider)
    {
        if(coll.CompareTag("Ball")) 
        {
            this.hp--
            this.anim.SetTrigger("Hit")
            
        }
    }
}