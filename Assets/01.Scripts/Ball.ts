import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { UnityEvent } from "UnityEngine.Events";
import { Transform, Vector3, Time, Rigidbody, ForceMode, Collision, Collider, SphereCollider, Input, Camera, Mathf, GameObject, Vector2, Object, Quaternion, Random, Physics} from 'UnityEngine';
import { isModuleBlock } from 'typescript';
import GameManager from './GameManager';


export default class Ball extends ZepetoScriptBehaviour {
    public speed: float;
    public dir: float;
    isLanding: boolean
    iscol: boolean
    shotable: bool = true
    public moving: bool;
    public zemini: bool
    public rb: Rigidbody;
    public skill_type: int
    public skill_use: bool
    public ghost: bool
    public col: Collider
    public zeminiball: GameObject
    public GM: GameManager

    Start() {
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.rb = this.gameObject.GetComponent<Rigidbody>();
        this.col = this.gameObject.GetComponent<SphereCollider>();
        if (this.zemini){
            this.Launch(new Vector3(Random.Range(1, -1), Random.Range(0.4, 1), 0))
            console.log(this.gameObject.GetComponentInParent<Rigidbody>().velocity)
        }
        else{
            this.GM.SkillUse.AddListener((int)=>this.SkillUsing(int))
            this.transform.position = this.GM.ballfirstpos
        }
    }

    Update()
    {
        
        if(this.transform.transform.position.y <= -8.6 && this.iscol){
            this.rb.velocity = Vector3.zero;
            this.isLanding = true
            this.moving = false
        }

        if(this.isLanding) {
            if(this.zemini){
                Object.Destroy(this.gameObject)
            }

            else this.transform.position = Vector3.Lerp(this.transform.position, this.GM.ballfirstpos, 0.25)
        }


        
    }
    
    Launch(pos: Vector3)
    {
        if(this.zemini) console.log(this.rb.velocity)
        this.iscol = false
        this.isLanding = false
        this.GM.shotTrigger = true
        this.moving = true
        this.rb.AddForce(pos * this.speed)
    }

    SkillUsing(type: int)
    {   
        this.skill_use = true
        this.skill_type = type
    }

    OnTriggerEnter(coll: Collider)
    {
        if (coll.CompareTag("Bottom"))
        {
            this.rb.velocity = Vector3.zero
            this.moving = false
            if(this.GM.isFirst){
                this.GM.BallLanding.Invoke(this.gameObject)
            }
            this.isLanding = true
            this.skill_use = false
        }
        
        else if (coll.CompareTag("Block") || coll.CompareTag("Wall"))
        {
            if (coll.CompareTag("Block") && this.skill_use && this.skill_type == 0 && !this.zemini){
                Object.Instantiate(this.zeminiball, this.transform.position, Quaternion.Euler(0,0,0), this.GM.BallGroup.transform)
                this.skill_use = false
            }
            var pos = this.rb.velocity.normalized;
            if (pos.magnitude != 0 && pos.y < 0.15 && pos.y > -0.15)
            {
                this.rb.velocity = Vector3.zero;
                this.rb.AddForce(new Vector3(pos.x > 0 ? 1 : -1, -0.2).normalized * this.speed, 0);
            }
            this.iscol = true
        }

        else if(coll.CompareTag("AddBall"))
        {
            this.GM.addingCount++
        }
    }

    
}