import { Transform, GameObject, Time } from 'UnityEngine'
import { SceneManager } from 'UnityEngine.SceneManagement'
import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'

export default class UIController extends ZepetoScriptBehaviour {

    GM: GameManager
    public exit: Button
    public close: Button
    public retry: Button
    public pause: Button
    public guide: Button
    public pausePanel: Transform
    public gameOverPanel: Transform

    Start() {    
        this.GM = this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>() 
        this.GM.GameOver.AddListener(()=>{
            this.gameOverPanel.gameObject.SetActive(true)
            this.BtnSetActive(true)
        })
        this.pause.onClick.AddListener(()=>{
            Time.timeScale = 0
            this.pausePanel.gameObject.SetActive(true)
            this.BtnSetActive(true)
        })
        this.close.onClick.AddListener(()=>{
            Time.timeScale = 1
            this.pausePanel.gameObject.SetActive(false)
            this.BtnSetActive(false)
        }) 
        this.exit.onClick.AddListener(()=>{
            SceneManager.LoadScene("Lobby")
        })
        this.retry.onClick.AddListener(()=>{
            SceneManager.LoadScene(SceneManager.GetActiveScene().name)
        })
    }

    BtnSetActive(set:bool)
    {
        this.exit.gameObject.SetActive(set)
        this.retry.gameObject.SetActive(set)
        this.guide.gameObject.SetActive(set)
    }
}