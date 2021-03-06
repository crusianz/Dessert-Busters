import { Compute_DistanceTransform_EventTypes } from 'TMPro'
import { Animator, Collider, Collision, GameObject, BoxCollider, Mathf, Quaternion, Object, Renderer, Color, MaterialPropertyBlock, AudioSource, AudioClip } from 'UnityEngine'
import { UnityEvent } from 'UnityEngine.Events';
import {Text} from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'

export default class Block extends ZepetoScriptBehaviour {


    audio: AudioSource
    public bounceFX: AudioClip
    public hp_t: Text   
    public isSelected: bool = false
    public particle: GameObject[]
    public type: int  
    public render: Renderer
    mpb: MaterialPropertyBlock
    hp: int
    GM: GameManager
    anim: Animator
    col: BoxCollider

    Start() {    
        this.render = this.transform.GetChild(0).GetComponent<Renderer>()
        this.audio = this.GetComponent<AudioSource>()
        this.mpb = new MaterialPropertyBlock()
        this.anim = this.gameObject.GetComponent<Animator>()
        this.col = this.GetComponent<BoxCollider>()
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.type = this.GM.phase
        this.hp_t = this.gameObject.GetComponentInChildren<Text>()
        this.hp = this.GM.layer
        this.GM.Breaking.AddListener((amount)=>(this.SkillDamage(amount)))
        this.GM.Select.AddListener(()=>(this.SelectInit()))
        this.transform.GetChild(this.type).gameObject.SetActive(true)
    }

    Update()
    {
        if(this.gameObject.transform.position.y < -7 && !this.GM.isgameOver){
            this.GM.GameOver.Invoke()
        }
        if(this.anim == null) this.anim = this.gameObject.GetComponent<Animator>()

        if(this.hp <= 0)
        {
            Object.Instantiate(this.particle[this.type], this.transform.position, Quaternion.Euler(90, 0, 0))
            this.col.enabled = false    
        }
        else this.col.enabled = true
        this.hp_t.text = String(this.hp)
    }

    SelectInit(){
        this.isSelected = false
    }

    SkillDamage(amount: int)
    {
        if(this.isSelected)
        {
            this.audio.Play()
            this.anim.SetTrigger("Hit")
            if (this.hp < amount) this.hp -= this.hp
            else this.hp -= amount
        }
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
            this.audio.Play()
            this.anim.SetTrigger("Hit")
            
        }
    }

    OnTriggerStay(coll: Collider)
    {
        console.log(coll.tag)
        if(coll.CompareTag("Select")){
            this.isSelected = true
        }
    }
}