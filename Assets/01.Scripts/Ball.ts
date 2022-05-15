import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { UnityEvent } from "UnityEngine.Events";
import { Transform, Vector3, Time, Rigidbody, ForceMode, Collision, Collider, SphereCollider, Input, Camera, Mathf, GameObject} from 'UnityEngine';
import { isModuleBlock } from 'typescript';
import GameManager from './GameManager';


export default class Ball extends ZepetoScriptBehaviour {
    public ballCount: int
    public launchIndex: int
    public addingCount: int
    public speed: float;
    public dir: float;
    public timerCount: float
    public timerStart: bool
    private shotTrigger: bool = false
    shotable: bool = true
    public moving: bool;
    public rb: Rigidbody;
    public col: Collider
    private veryFirstpos: Vector3
    public GM: GameManager

    Start() {
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.rb = this.gameObject.GetComponent<Rigidbody>();
        this.col = this.gameObject.GetComponent<SphereCollider>();
    }

    Awake()
    {

    }

    /*Update() {

        this.shotable = true

        for (let i = 0; i < this.GM.BallGroup.transform.childCount; i++){
            if (this.GM.BallGroup.transform.GetChild(i).GetComponent<Ball>().moving) this.shotable = false;
        }

        if (this.GM.isBlockMoving) this.shotable = false;

        if (!this.shotable) return;

        if(!this.shotTrigger) this.Shot()

        if(this.shotable && this.shotTrigger){
            this.shotTrigger = false
            if(this.GM.BallGroup.transform.childCount <= 1 || this.GM.BallGroup.transform.GetChild(1).GetComponent<Ball>().moving == false)
            {
                this.GM.Down.Invoke(this.gameObject)
          }
         this.GM.Fall.Invoke()
         this.addingCount = 0
        }
    }

    FixedUpdate(){
        if(this.timerStart && ++this.timerCount == 3)
        {
            this.timerCount = 0 
            this.GM.BallGroup.transform.GetChild(this.launchIndex++).GetComponent<Ball>().Launch(this.gap)
            //this.countTxt.text = "x" + (this.GM.BallGroup.transform.childCount - this.launchIndex).toString() 
            if(this.launchIndex == this.GM.BallGroup.transform.childCount)
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
    }*/
    
    Launch(pos: Vector3)
    {
        this.GM.shotTrigger = true
        this.moving = true
        this.rb.AddForce(pos * this.speed)
    }

    OnTriggerEnter(coll: Collider)
    {
        if (coll.CompareTag("Bottom"))
        {
            this.veryFirstpos = this.transform.position
            this.moving = false
            this.rb.velocity = Vector3.zero
            console.log("stop it!")
        }
        
        else if (coll.CompareTag("Block"))
        {
            console.log("collision!");
        }

        

        else if(coll.CompareTag("AddBall"))
        {
            this.GM.addingCount++
        }
    }

    
}