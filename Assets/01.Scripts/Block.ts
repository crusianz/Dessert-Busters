import { Compute_DistanceTransform_EventTypes } from 'TMPro'
import { Animator, Collider, Collision, GameObject, BoxCollider } from 'UnityEngine'
import { UnityEvent } from 'UnityEngine.Events';
import {Text} from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'

export default class Block extends ZepetoScriptBehaviour {

    public hp_t: Text
    hp: int
    GM: GameManager
    anim: Animator

    Start() {    
        
        this.anim = this.gameObject.GetComponent<Animator>()
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.hp_t = this.gameObject.GetComponentInChildren<Text>()
        this.hp = this.GM.layer
    }

    Update()
    {
        this.hp_t.text = String(this.hp)
    }

    public Death()
    {
        if(this.hp <= 0)
        {
            this.GetComponent<BoxCollider>().enabled = false
            GameObject.Destroy(this.gameObject)
        }
    }

    OnEnable()
    {
        
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