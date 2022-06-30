import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject} from 'UnityEngine'
import {Entry} from "UnityEngine.EventSystems.EventTrigger";
import {EventTrigger, EventTriggerType} from "UnityEngine.EventSystems";
import GameManager from './GameManager'

export default class Buttons extends ZepetoScriptBehaviour {

    GM: GameManager


    Start() {    

        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()

        var trigger = this.gameObject.GetComponent<EventTrigger>();

        var entry = new Entry();
        var disentry = new Entry();

        entry.eventID = EventTriggerType.PointerEnter
        entry.callback.AddListener(() => {
            this.GM.clickable = false
            console.log("no touch!")
        });

        disentry.eventID = EventTriggerType.PointerExit;
        disentry.callback.AddListener(()=>{
            this.GM.clickable = true
            console.log("yes touch!")
        })
  
        trigger.triggers.Add(entry);
        trigger.triggers.Add(disentry);
    }

}