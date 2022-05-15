import { isBreakOrContinueStatement } from 'typescript'
import { Camera, GameObject, Rect, Screen, Transform, Vector3, Input } from 'UnityEngine'
import {Text} from 'UnityEngine.UI';
import { UnityEvent, UnityEvent$1 } from 'UnityEngine.Events'
import { ZepetoCamera, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Ball from './Ball'

export default class GameManager extends ZepetoScriptBehaviour {


    public Down: UnityEvent$1<GameObject>
    public Fall: UnityEvent
    public AddingBall: UnityEvent
    camera: Camera
    rect: Rect
    private ball: GameObject
    public BallGroup: GameObject
    public gap: Vector3
    private firstpos: Vector3
    private secondpos: Vector3
    public addingCount: int
    public layer: int
    public curScore: int = 0
    spcScore: int
    normal_mob: int
    spc_mob: int
    public timerCount: int
    launchIndex: int
    screen_Scale: float[]
    public timerStart: boolean
    public isBlockMoving: boolean
    public shotable: boolean
    public shotTrigger: bool

    Awake() {
        this.Down = new UnityEvent$1<GameObject>()
        this.Fall = new UnityEvent()
        this.Fall.AddListener(()=>this.AddLayer())
        this.AddingBall = new UnityEvent()
        
        //ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(false);
        this.layer = 1

        this.camera = Camera.main;
        this.rect = this.camera.rect;
        this.screen_Scale[0] = (Screen.width / Screen.height) / (9 / 16);
        this.screen_Scale[1] = 1 / this.screen_Scale[0];
        if (this.screen_Scale[0] < 1) {
            this.rect.height = this.screen_Scale[0];
            this.rect.y = (1 - this.screen_Scale[0]) / 2;
        }
        else
        {
            this.rect.width = this.screen_Scale[1];
            this.rect.x = (1 - this.screen_Scale[1]) / 2;
        }
        this.camera.rect = this.rect;

    }

    Start() {    

    }
    //#region 공 발사
    Update() {

        this.shotable = true

        for (let i = 0; i < this.BallGroup.transform.childCount; i++){
            if (this.BallGroup.transform.GetChild(i).GetComponent<Ball>().moving) this.shotable = false;
        }

        if (this.isBlockMoving) this.shotable = false;

        if (!this.shotable) return;

        if(!this.shotTrigger) this.Shot()

        if(this.shotable && this.shotTrigger){
            this.shotTrigger = false
            if(this.BallGroup.transform.childCount <= 1 || this.BallGroup.transform.GetChild(1).GetComponent<Ball>().moving == false)
            {
                this.Down.Invoke(this.BallGroup.transform.GetChild(0).gameObject)
          }
         this.Fall.Invoke()
         this.addingCount = 0
        }
    }

    
    FixedUpdate(){
        if(this.timerStart && ++this.timerCount == 3)
        {
            this.timerCount = 0 
            this.BallGroup.transform.GetChild(this.launchIndex++).GetComponent<Ball>().Launch(this.gap)
            //this.countTxt.text = "x" + (this.BallGroup.transform.childCount - this.launchIndex).toString() 
            if(this.launchIndex == this.BallGroup.transform.childCount)
            {
                this.timerStart = false
                this.launchIndex = 0
                //this.countTxt.text = ""
            }
        }
    }

    Shot() {
        if(Input.GetMouseButtonDown(0))
        {
            this.firstpos = Input.mousePosition
        }

        if(Input.GetMouseButton(0))
        {
            this.secondpos = Input.mousePosition
            if((this.secondpos - this.firstpos).magnitude < 1) return;
            this.gap = (this.secondpos - this.firstpos).normalized
            console.log(Input.mousePosition)
        }

        if(Input.GetMouseButtonUp(0))
        {
            this.timerStart = true
            
        }
    }
    //#endregion

    AddLayer()
    {
        this.layer++
    }   

}