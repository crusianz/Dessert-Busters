import { isBreakOrContinueStatement } from 'typescript'
import { Camera, GameObject, Rect, Screen, Transform, Vector3, Input, LineRenderer, RaycastHit, Physics, LayerMask, Mathf, Quaternion,
Debug, Color, AnimationClip, WaitForSeconds } from 'UnityEngine'
import {Button, Text} from 'UnityEngine.UI';
import { UnityEvent, UnityEvent$1 } from 'UnityEngine.Events'
import { ZepetoCamera, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Ball from './Ball'

export default class GameManager extends ZepetoScriptBehaviour {

    //#region 이벤트
    public Down: UnityEvent$1<GameObject>
    public Fall: UnityEvent
    public AddingBall: UnityEvent
    public GameOver: UnityEvent
    public BallLanding: UnityEvent$1<GameObject>
    public ScoreUp: UnityEvent$1<int>
    public SkillUse: UnityEvent$1<int>
    public Select: UnityEvent
    public Breaking: UnityEvent$1<int>  
    //#endregion 

    public button: Button

    //#region 공 관련 변수
    private ball: GameObject
    public BallGroup: GameObject
    public Cannon: GameObject
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
    public clickable: bool 
    public shotTrigger: bool
    //#endregion 

    spc_monster: int[] = [0, 0, 0, 0, 0]
    skill_useable: boolean[] = [false, false, false, false, false]
    skill_cooltime: int[] = [3,5,7,9]

    //#region 블록 스폰 관련 변수
    public layer: int
    public phase : int
    public isBlockMoving: boolean
    //#endregion

    //#region 기타 변수
    camera: Camera
    rect: Rect
    public Scoretxt: Text
    public countTxt: Text
    LR: LineRenderer
    BallLR: LineRenderer
    gameOver = false

    public curScore: int = 0
    mob_spawnScore: int = 0
    scoreAddValue: int
    normal_mob: int
    screen_Scale: float[]
    public layermask: LayerMask[]
    public animclip: AnimationClip[]
    skill_selecting: bool
    //#endregion
    
    Awake() {
        //#region 이벤트 관리
        this.scoreAddValue = 30
        this.ballfirstpos = new Vector3(-2.15, -8.6, 0)
        this.launchIndex = 0
        this.Down = new UnityEvent$1<GameObject>()
        this.Fall = new UnityEvent()
        this.Fall.AddListener(()=>this.AddLayer())
        this.BallLanding = new UnityEvent$1<GameObject>()
        this.BallLanding.AddListener((pos)=> this.PosSetting(pos))
        this.GameOver = new UnityEvent()
        this.clickable = true
    
        this.SkillUse = new UnityEvent$1<int>()
        this.SkillUse.AddListener((type)=>this.Skill_used(type))
        this.ScoreUp = new UnityEvent$1<int>()
        this.ScoreUp.AddListener((type)=>this.ScoreAdd(type))
        this.AddingBall = new UnityEvent()
        this.Select = new UnityEvent()
        this.Breaking = new UnityEvent$1<int>()
        //#endregion
        this.layer = 1
        this.skill_cooltime = [3,5,7,9]
        /*this.camera = Camera.main;
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
        */
    }

    Start() {    
        //ZepetoPlayers.instance.characterData.minMoveDistance = 100
    }
    //#region 공 발사
    Update() {
        if(this.skill_selecting) this.clickable = false
        this.Cannon.transform.position = Vector3.Lerp(this.Cannon.transform.position, new Vector3(this.ballfirstpos.x, this.Cannon.transform.position.y, -1), 0.4)
        var player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character
        var playerT = player.transform
        
        if(Mathf.Abs(playerT.position.x - this.ballfirstpos.x) <= 0.6){
            playerT.rotation = Quaternion.Euler(new Vector3(0,0,0))
            this.Cannon.transform.GetChild(0).rotation = Quaternion.Euler(new Vector3(-180, 270, -270))
        }

        this.shotable = true
        this.Scoretxt.text = "Score : " + this.curScore.toString()
        for (let i = 0; i < this.BallGroup.transform.childCount; i++){
            if (this.BallGroup.transform.GetChild(i).GetComponent<Ball>().moving) this.shotable = false;
        }

        if (this.isBlockMoving) this.shotable = false;

        if (!this.shotable || !this.clickable) return;

        if(!this.shotTrigger) this.Shot()

        if(this.shotable && this.shotTrigger){
            this.shotTrigger = false
            if(this.BallGroup.transform.childCount <= 1 || this.BallGroup.transform.GetChild(1).GetComponent<Ball>().moving == false)
            {
                this.Down.Invoke(this.BallGroup.transform.GetChild(0).gameObject)
          }
         this.Fall.Invoke()
         this.addingCount = 0
         this.countTxt.text = "x" + this.BallGroup.transform.childCount.toString()
        }

        
    }
    
    FixedUpdate(){
        if(this.timerStart && ++this.timerCount == 3)
        {
            console.log(this.launchIndex, this.timerCount)
            this.timerCount = 0 
            this.BallGroup.transform.GetChild(this.launchIndex++).GetComponent<Ball>().Launch(this.gap)
            this.countTxt.text = "x" + (this.BallGroup.transform.childCount - this.launchIndex).toString() 
            if(this.launchIndex >= this.BallGroup.transform.childCount)
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
            this.firstpos = Camera.main.ScreenToWorldPoint(Input.mousePosition) + new Vector3(0, 0, 10)
        }

        if(Input.GetMouseButton(0))
        {
            this.secondpos = Camera.main.ScreenToWorldPoint(Input.mousePosition) + new Vector3(0, 0, 10)
            if((this.secondpos - this.firstpos).magnitude < 1) return;
            this.gap = (this.secondpos - this.firstpos).normalized
            this.gap = new Vector3(this.gap.y >= 0 ? this.gap.x : this.gap.x >= 0 ? 1 : -1, Mathf.Clamp(this.gap.y, 0.2, 1), 0)

            let ref = $ref<RaycastHit>();
            
            Physics.Raycast(this.ballfirstpos, this.gap, ref, 10000, 1 << LayerMask.NameToLayer("Wall") | 1 << LayerMask.NameToLayer("Block"))

            let hit = $unref(ref)
            this.LR.SetPosition(0, this.firstpos)
            this.LR.SetPosition(1, this.secondpos)
            this.BallLR.SetPosition(0, this.ballfirstpos)
            this.BallLR.SetPosition(1, hit.point)
            this.Cannon.transform.GetChild(0).transform.rotation =  Quaternion.Euler(this.fGetAngle(this.Cannon.transform.position,this.BallLR.GetPosition(1)) + 90 ,270, -270)
        }

        if(Input.GetMouseButtonUp(0))
        {
    
            this.LR.SetPosition(0,Vector3.zero)
            this.LR.SetPosition(1,Vector3.zero)
            this.BallLR.SetPosition(0, Vector3.zero)
            this.BallLR.SetPosition(1, Vector3.zero)
            this.timerStart = true
            this.isFirst = true
            var player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character
            player.SetGesture(this.animclip[0])
            this.StartCoroutine(this.AnimCancle());
        }
    }

    *AnimCancle(){
        while(true){
            yield null
            yield new WaitForSeconds(1.4);
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.CancelGesture()
        }
    }

    PosSetting(pos: GameObject)
    {
        this.ballfirstpos = new Vector3(pos.transform.position.x, -8.6, 0)
        this.isFirst = false   

        var player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character
        var playerT = player.transform

        if(Mathf.Abs(playerT.position.x - this.ballfirstpos.x) > 0.1) player.MoveToPosition(new Vector3(this.ballfirstpos.x, playerT.position.y, playerT.position.z))

    }
    //#endregion

    ScoreAdd(type: int)
    {
        switch(type)
        {
            case 1 : {
                     this.curScore += this.scoreAddValue * 2
                     this.mob_spawnScore += this.scoreAddValue
                    }
                     break;

            default : {
                      this.curScore += this.scoreAddValue
                      this.mob_spawnScore += this.scoreAddValue
                    }
        }
        while(this.mob_spawnScore >= 300){
            this.mob_spawnScore -= 300
            this.normal_mob++
        }
            
    }

    Skill_used(type: int)
    {
        if(this.skill_selecting)
        {
            if(type == 2) this.Breaking.Invoke(Mathf.RoundToInt(this.BallGroup.transform.childCount / 5))
            else if(type == 3) {
                this.Breaking.Invoke(this.layer)
            }

            this.skill_cooltime[type] = 3 + 2 * type
            this.skill_selecting = false
            return;
        }

        if(type < 2)
        {
            this.skill_useable[type] = false
            this.skill_cooltime[type] = 3 + 2 * type
            for(let i = 0; i < 4; i++){
                if (i == type) continue
                this.skill_cooltime[i]++
                this.skill_useable[i] = false
            } 
            
        }

        else {
            this.clickable = false
            for(let i = 0; i < 4; i++){
                if (i == type) continue
                this.skill_cooltime[i]++
                this.skill_useable[i] = false
            }
            this.skill_selecting = true
        }
    }
    
    AddLayer()
    {
        this.layer++
        for(let i = 0; i < 4; i++)
            {
                if(!this.skill_useable[i] && this.skill_cooltime[i] > 0 && this.spc_monster[i] > 0){
                    this.skill_cooltime[i]--
                    if(this.skill_cooltime[i] <= 0) this.skill_useable[i] = true
                }
            }
    }   

    public fGetAngle (vStart: Vector3, vEnd: Vector3)
    {
        let v = vEnd - vStart;
 
        return Mathf.Atan2(v.y, v.x) * Mathf.Rad2Deg;
    }

}