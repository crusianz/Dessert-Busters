import { Camera, Color, GameObject } from 'UnityEngine'
import {Entry} from "UnityEngine.EventSystems.EventTrigger";
import {EventTrigger, EventTriggerType} from "UnityEngine.EventSystems";
import { Button, Text } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'

export default class SkillButton extends ZepetoScriptBehaviour {

    public buttons: Button[]
    GM: GameManager

    Start() {    
        var trigger = this.gameObject.GetComponent<EventTrigger>();

        var entry = new Entry();

        entry.eventID = EventTriggerType.PointerUp;
        entry.callback.AddListener(() => {
            console.log("click")
        });
  
        trigger.triggers.Add(entry);

        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        for(let i = 0; i < this.buttons.length; i++){
            this.buttons[i].interactable = false
        }
        
    }

    Update()
    {
        for(let i = 0; i < this.buttons.length; i++){
            let ctText = this.buttons[i].gameObject.GetComponentInChildren<Text>()
            //console.log(this.GM.skill_cooltime)
            ctText.text = this.GM.skill_cooltime[i].toString() + "턴"
        }
    }
}