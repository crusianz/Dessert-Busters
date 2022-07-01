import { AudioClip, AudioSource, Camera, Color, GameObject, Random, Vector3 } from 'UnityEngine'
import {Entry} from "UnityEngine.EventSystems.EventTrigger";
import {EventTrigger, EventTriggerType} from "UnityEngine.EventSystems";
import { Button, Image, Text } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'

export default class SkillButton extends ZepetoScriptBehaviour {

    audio: AudioSource
    public BtnFx: AudioClip[]
    public buttons: Button[]
    public image: Image[]
    GM: GameManager

    Start() {    
        this.audio = this.GetComponent<AudioSource>()
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        for(let i: int = 0; i < this.buttons.length; i++){
            this.buttons[i].interactable = false
            if(i == 4) continue;
            this.buttons[i].onClick.AddListener(()=>{
                this.GM.SkillUse.Invoke(i)
                this.audio.PlayOneShot(Random.Range(0,1) < 1 ? this.BtnFx[0] : this.BtnFx[1])
            })
        }
        
    }

    Update()
    {
        for(let i = 0; i < this.GM.skill_cooltime.length; i++){
            let sc = this.GM.skill_cooltime
            if(sc[i] != 0 || !this.GM.skill_useable[i]){
                this.buttons[i].interactable = false
                this.image[i].fillAmount = ((3 + i * 2) - sc[i]) * (1 / (3 + i * 2))
                this.buttons[i].transform.localScale = new Vector3(0.85, 0.85, 1)   
            }
            else if(sc[i] <= 0 || this.GM.skill_useable[i])
            {
                this.image[i].fillAmount = 0
                this.buttons[i].interactable = true
                this.buttons[i].transform.localScale = new Vector3(1, 1, 1)   
            }
        }

        if(this.GM.spc_monster[4] > 0){
            this.buttons[4].interactable = true
            this.buttons[4].transform.localScale = new Vector3(0.85, 0.85, 1)
        }
        else{
            this.buttons[4].interactable = false
            this.buttons[4].transform.localScale = new Vector3(1, 1, 1)  
        }
    }
}