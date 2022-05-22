import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { UnityEvent } from "UnityEngine.Events";
import { Transform, Vector3, Time, Rigidbody, ForceMode, Collision, Collider, SphereCollider, Input, Camera, Mathf, GameObject, Vector2} from 'UnityEngine';
import { isModuleBlock } from 'typescript';
import GameManager from './GameManager';


export default class Ball extends ZepetoScriptBehaviour {
    public speed: float;
    public dir: float;
    isLanding: boolean
    iscol: boolean
    shotable: bool = true
    public moving: bool;
    public rb: Rigidbody;
    public col: Collider
    public GM: GameManager

    Start() {
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.rb = this.gameObject.GetComponent<Rigidbody>();
        this.col = this.gameObject.GetComponent<SphereCollider>();
        this.transform.position = this.GM.ballfirstpos
        
    }

    Update()
    {
        if(this.isLanding) this.transform.position = Vector3.Lerp(this.transform.position, this.GM.ballfirstpos, 0.25)
        if(this.transform.transform.position.y <= -12.34 && this.iscol){
            this.rb.velocity = Vector3.zero;
            this.isLanding = true
            this.moving = false
        }
        
    }
    
    Launch(pos: Vector3)
    {
        this.iscol = false
        this.isLanding = false
        this.GM.shotTrigger = true
        this.moving = true
        this.rb.AddForce(pos * this.speed)
    }

    OnTriggerEnter(coll: Collider)
    {
        if (coll.CompareTag("Bottom"))
        {
            this.rb.velocity = Vector3.zero
            this.moving = false
            if(this.GM.isFirst){
                this.GM.BallLanding.Invoke(this.gameObject)
                this.isLanding = true
                console.log("stop it!")
            }
            else this.isLanding = true
        }
        
        else if (coll.CompareTag("Block") || coll.CompareTag("Wall"))
        {
            var pos = this.rb.velocity.normalized;
            if (pos.magnitude != 0 && pos.y < 0.15 && pos.y > -0.15)
            {
                this.rb.velocity = Vector3.zero;
                this.rb.AddForce(new Vector3(pos.x > 0 ? 1 : -1, -0.2).normalized * this.speed, 0);
            }
            console.log("collision!");
            this.iscol = true
        }

        else if(coll.CompareTag("AddBall"))
        {
            this.GM.addingCount++
        }
    }

    
}