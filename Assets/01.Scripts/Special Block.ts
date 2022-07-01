import { Mathf, GameObject, Renderer, Animator, BoxCollider, AudioSource } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Text} from 'UnityEngine.UI'
import Block from './Block';
import GameManager from './GameManager'

export default class SpecialBlock extends Block {

    Start(){
        this.render = this.transform.GetChild(0).GetComponent<Renderer>()
        this.audio = this.GetComponent<AudioSource>()
        this.anim = this.gameObject.GetComponent<Animator>()
        this.col = this.GetComponent<BoxCollider>()
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.type = this.GM.phase
        this.hp_t = this.gameObject.GetComponentInChildren<Text>()
        this.GM.Breaking.AddListener((amount)=>(this.SkillDamage(amount)))
        this.GM.Select.AddListener(()=>(this.SelectInit()))
        this.transform.GetChild(6+this.type).gameObject.SetActive(true)
        this.hp = Mathf.RoundToInt(this.GM.layer * 2.5)
    }

    Death(){
        if(this.hp <= 0) {
            this.GM.ScoreUp.Invoke(1)
            GameObject.Destroy(this.gameObject)
        }
    }
}