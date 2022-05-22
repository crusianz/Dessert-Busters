import { isBreakOrContinueStatement } from 'typescript'
import { Camera, GameObject, Rect, Screen, Transform, Vector3, Vector2, Input, LineRenderer, RaycastHit, Physics, LayerMask, Mathf } from 'UnityEngine'
import {Text} from 'UnityEngine.UI';
import { UnityEvent, UnityEvent$1 } from 'UnityEngine.Events'
import { ZepetoCamera, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Ball from './Ball'

export default class GameManager extends ZepetoScriptBehaviour {

    //#region 이벤트
    public Down: UnityEvent$1<GameObject>
    public Fall: UnityEvent
    public AddingBall: UnityEvent
    public BallLanding: UnityEvent$1<GameObject>
    public ScoreUp: UnityEvent$1<int>
    //#endregion 

    //#region 공 관련 변수
    private ball: GameObject
    public BallGroup: GameObject
    public gap: Vector3
    public ballfirstpos: Vector3
    private firstpos: Vector3
    private secondpos: Vector3
    public addingCount: int
    public timerCount: int
    launchIndex: int
    public isFirst: boolean
    public timerStart: boolean
    public shotable: boolean
    public shotTrigger: bool
    //#endregion 

    //#region 블록 스폰 관련 변수
    public layer: int
    public isBlockMoving: boolean
    //#endregion

    //#region 기타 변수
    camera: Camera
    rect: Rect
    public Scoretxt: Text
    public countTxt: Text
    LR: LineRenderer
    public curScore: int = 0
    spcScore: int
    normal_mob: int
    spc_mob: int
    screen_Scale: float[]
    public layermask: LayerMask[]
    //#endregion
    
    Awake() {
        //#region 이벤트 관리
        this.ballfirstpos = new Vector3(-2.15, -12.35, 0)
        this.Down = new UnityEvent$1<GameObject>()
        this.Fall = new UnityEvent()
        this.Fall.AddListener(()=>this.AddLayer())
        this.BallLanding = new UnityEvent$1<GameObject>()
        this.BallLanding.AddListener((pos)=> this.PosSetting(pos))
        this.ScoreUp = new UnityEvent$1<int>()
        this.ScoreUp.AddListener((type)=>this.ScoreAdd(type))
        this.AddingBall = new UnityEvent()
        //#endregion

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
        this.Scoretxt.text = "점수 : " + this.curScore.toString()
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
            this.countTxt.text = "x" + (this.BallGroup.transform.childCount - this.launchIndex).toString() 
            if(this.launchIndex == this.BallGroup.transform.childCount)
            {
                this.timerStart = false
                this.launchIndex = 0
                this.countTxt.text = ""
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
            this.gap = new Vector3(this.gap.y >= 0 ? this.gap.x : this.gap.x >= 0 ? 1 : -1, Mathf.Clamp(this.gap.y, 0.2, 1), 0)
            //console.log(Input.mousePosition)

            let ref = $ref<RaycastHit>();
            let startpos = new Vector2(this.ballfirstpos.x, this.ballfirstpos.y)
            let endpos = new Vector2(this.gap.x, this.gap.y)
            if(Physics.Raycast(this.ballfirstpos, this.gap, ref, 10000, 1 << LayerMask.NameToLayer("Wall")))
            {
                
            }
            let hit = $unref(ref)
            this.LR.SetPosition(0,this.ballfirstpos)
            this.LR.SetPosition(1,hit.point)
        }

        if(Input.GetMouseButtonUp(0))
        {
            this.LR.SetPosition(0,Vector3.zero)
            this.LR.SetPosition(1,Vector3.zero)
            this.timerStart = true
            this.isFirst = true
        }
    }

    PosSetting(pos: GameObject)
    {
        this.ballfirstpos = pos.transform.position
        this.isFirst = false
        
    }
    //#endregion

    ScoreAdd(type: int)
    {
        switch(type)
        {
            case 1 : this.curScore += 60
                     break;
            default : this.curScore += 30  
        }
        
    }

    AddLayer()
    {
        this.layer++
    }   

}