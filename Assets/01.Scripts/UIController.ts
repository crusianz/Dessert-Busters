import { Transform, GameObject, Time, PlayerPrefs } from 'UnityEngine'
import { SceneManager } from 'UnityEngine.SceneManagement'
import { Button, Text } from 'UnityEngine.UI'
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
    public guidePanel: Transform
    public Score: Text
    public HighScore: Text

    Start() {    
        
        this.GM = this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>() 
        this.GM.GameOver.AddListener(()=>{
            this.gameOverPanel.gameObject.SetActive(true)
            this.BtnSetActive(true)
        })
        this.pause.onClick.AddListener(()=>{
            Time.timeScale = 0
            this.pausePanel.gameObject.SetActive(true)
            this.GM.isPause = true
            this.close.gameObject.SetActive(true)
            this.BtnSetActive(true)
        })
        this.close.onClick.AddListener(()=>{
            Time.timeScale = 1
            this.pausePanel.gameObject.SetActive(false)
            this.guidePanel.gameObject.SetActive(false)
            this.GM.isPause = false
            this.close.gameObject.SetActive(false)
            this.BtnSetActive(false)
        }) 

        this.guide.onClick.AddListener(()=>{
            this.guidePanel.gameObject.SetActive(true)
            this.exit.gameObject.SetActive(true)
        })

        this.exit.onClick.AddListener(()=>{
            SceneManager.LoadScene("Lobby")
        })
        this.retry.onClick.AddListener(()=>{
            SceneManager.LoadScene(SceneManager.GetActiveScene().name)
        })

        this.GM.Guide.AddListener(()=>{
            Time.timeScale = 0
            this.pausePanel.gameObject.SetActive(true)
            this.GM.isPause = true
            this.BtnSetActive(true)
            this.guidePanel.gameObject.SetActive(true)
            this.close.gameObject.SetActive(true)
            this.exit.gameObject.SetActive(true)
        })
    }

    gameOverText(){
        this.Score.text = "Your Score\n" + this.GM.curScore.toString()
        this.HighScore.text = "High Score\n" + PlayerPrefs.GetInt(this.GM.highScoreKey, 0).toString()
    }

    BtnSetActive(set:bool)
    {
        this.exit.gameObject.SetActive(set)
        this.retry.gameObject.SetActive(set)
        this.guide.gameObject.SetActive(set)
    }
}