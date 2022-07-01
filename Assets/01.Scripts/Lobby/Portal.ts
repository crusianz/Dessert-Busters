import { GameObject } from 'UnityEngine'
import { SceneManager } from 'UnityEngine.SceneManagement'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Portal extends ZepetoScriptBehaviour {

    joinWindow: GameObject
    yesBtn: Button
    noBtn: Button

    Start() {    
        this.yesBtn.onClick.AddListener(()=>(SceneManager.LoadScene(1)))
        this.noBtn.onClick.AddListener(()=>{
            this.joinWindow.SetActive(false)
        })
    }



}