import {Camera, BoxCollider, GameObject, Vector3, Input, Mathf } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'

export default class Skill extends ZepetoScriptBehaviour {

    GM: GameManager
    collider: BoxCollider
    type: int 
    vertical: bool
    @SerializeField()
    width: int[] = [1, 28, 5]
    height: int[] = [30, 1, 5]

    Start() {    
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.GM.SkillUse.AddListener((type)=>this.Selecting(type))
        this.GM.Breaking.AddListener(()=>this.SelectEnd())
        this.collider = this.gameObject.GetComponent<BoxCollider>()
        this.collider.enabled = false
    }

    Update(){
        if(Input.GetMouseButtonDown(0))
        {
            this.GM.Select.Invoke()
            let x = Camera.main.ScreenToWorldPoint(Input.mousePosition).x
            let y = Camera.main.ScreenToWorldPoint(Input.mousePosition).y
            console.log("origin : " + x, y)
            if (x < -7.4) return
            else if(x > 9 && x < 10) return
            else {
                console.log(Mathf.Abs(x + 6.6) / 1.8)
                x = -6.6 + (1.8 * Mathf.RoundToInt(Mathf.Abs(x + 6.6) / 1.8))
                console.log("done!")
            }
            if (y > 5.6) return
            else if(y < -7) return
            else {
                console.log(Mathf.Abs(y - 4.9) / 1.8)
                y = 4.9 - (1.8 * Mathf.RoundToInt(Mathf.Abs(y - 4.9) / 1.8))
                console.log("done2!")
                console.log(x, y)
            }
            
            if(this.type == 2 && this.vertical) y = 4.9 - 1.8 * 3

            else if(this.type == 2 && !this.vertical) x = -6.6 + 1.8 * 2

            this.transform.position = new Vector3(x, y, 0)
        }

    }

    Selecting(type: int)
    {
        this.type = type;
        this.collider.size = new Vector3(this.width[type-1], this.height[type-1], 1)
        this.collider.enabled = true
        this.transform.position = new Vector3(-6.6 + 1.8, 4.9 - 3.6, 0)
    }

    SelectEnd(){
        this.collider.enabled = false
    }
}