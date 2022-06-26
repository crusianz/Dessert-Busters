import { Compute_DistanceTransform_EventTypes } from 'TMPro'
import { Animator, Collider, Collision, GameObject, BoxCollider, Mathf } from 'UnityEngine'
import { UnityEvent } from 'UnityEngine.Events';
import {Text} from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'

export default class Block extends ZepetoScriptBehaviour {

    public hp_t: Text   
    public isSelected: bool = false  
    hp: int
    GM: GameManager
    anim: Animator
    col: BoxCollider

    Start() {    
        this.anim = this.gameObject.GetComponent<Animator>()
        this.col = this.GetComponent<BoxCollider>()
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.hp_t = this.gameObject.GetComponentInChildren<Text>()
        this.hp = this.GM.layer
        this.GM.SkillUse.AddListener((int)=>this.SelectInit(int))
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

    SelectInit(num: int){
        if(num == 2) this.isSelected = false
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

        if(coll.CompareTag("Select")){
            this.isSelected = true
        }
    }
}