import { GameObject, Object, Quaternion, Random, Time, Transform, Vector3, Mathf, Coroutine, WaitForSeconds, BoxCollider, Component } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'
import Ball from './Ball'
import Block from './Block'

export default class BlockSpawner extends ZepetoScriptBehaviour {

GM: GameManager
public spawnList: Vector3[]
public BlockCount: int
public p_block: GameObject
public p_Ball: GameObject
public p_spcBlock: GameObject[]
public main_Ball: GameObject
public BlockGroup: GameObject
public BallGroup: GameObject
public isBlockMoving: boolean
public isSpcSpawning: boolean
public spcScore: int
public spcReq: int
public downPower: number
public QI: Quaternion
wolf_skill_ing: bool
count: int

    Start() {
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.Counting()
        this.Spawn()
        this.GM.Fall.AddListener(()=>this.Counting())
        this.GM.Fall.AddListener(()=>this.Spawn())
        this.GM.Down.AddListener((pos) => this.AddBall(pos))
        this.GM.ScoreUp.AddListener((num)=>this.spcCount(num))
        this.GM.SkillUse.AddListener((num)=>this.Penetration(num))
        this.GM.WolfSkill.AddListener(()=>this.WolfSelect())
        this.QI = Quaternion.Euler(0,0,0)
    }


    public Counting(){
        let tr: Transform = this.transform    
        for (let i = 0; i < 6; i++ ){ this.spawnList.push(new Vector3(tr.position.x + i * 1.8, tr.position.y, tr.position.z))}
        this.count = 0
        let randBl = Random.Range(0, 24)
        this.BlockCount = this.BlockGroup.transform.childCount

        if(this.BlockCount < 5 || this.GM.curScore < 300) this.count = randBl < 16 ? 1 : 2
        if((this.BlockCount > 4 && this.BlockCount < 15) || (this.GM.curScore >= 300 && this.GM.curScore < 800)) this.count = randBl < 16 ? 2 : 3
        if((this.BlockCount > 14 && this.BlockCount < 25) || (this.GM.curScore >= 800 && this.GM.curScore < 2000)) this.count = randBl < 12 ? 3 : 4
        if(this.BlockCount > 24 || this.GM.curScore >= 2000) this.count = randBl < 12 ? 4 : 5
        if(this.isSpcSpawning && this.count < 5){
            this.count += 1
        }
        
        
    }

    public Spawn(){
        if(this.wolf_skill_ing) return
        var gameObj = this.p_block
        var spcObj = this.p_spcBlock[0]
        for (let i = 0; i < this.count; i++ ){
            var rand = Mathf.RoundToInt(Random.Range(0, this.spawnList.length-1))
            var pos = new Vector3(this.spawnList[rand].x, this.spawnList[rand].y, this.spawnList[rand].z)
            if(this.isSpcSpawning){
                var sObj = Object.Instantiate(spcObj, pos, Quaternion.Euler(0,0,0),this.BlockGroup.transform)    
                this.isSpcSpawning = false
            }
            else var Obj = Object.Instantiate(gameObj, pos , Quaternion.Euler(0,0,0),this.BlockGroup.transform)
            this.spawnList.splice(rand, 1)
            this.BlockCount++
        }

        Object.Instantiate(this.p_Ball, this.spawnList[Mathf.RoundToInt(Random.Range(0, this.spawnList.length-1))], Quaternion.Euler(0,0,0), this.BlockGroup.transform)

        //#region 블록 내리기
        this.isBlockMoving = true
        for (let i = 0; i<this.BlockGroup.transform.childCount; i++){
            this.StartCoroutine(this.BlockMoveDown(this.BlockGroup.transform.GetChild(i)))
        }
        this.spawnList.splice(0,this.spawnList.length)
        //#endregion
        
        
    }

    *BlockMoveDown(TR: Transform){
        yield new WaitForSeconds(0.2)
        var targetPos = TR.position + new Vector3(0,this.downPower,0)

        if(targetPos.y < -14){
            if(TR.CompareTag("Block")) this.GM.isBlockMoving = false
        }

        let TT = 0.8
        while(true){
            yield null
            TT -= Time.deltaTime * 1.5
            TR.position = Vector3.MoveTowards(TR.position, targetPos + new Vector3(0,(this.downPower / 5),0), TT)
            if(TR.position == targetPos + new Vector3(0, (this.downPower / 5), 0) || TT <= 0) break
        }

        TT = 0.2
        while(true){
            yield null
            TT -= Time.deltaTime
            TR.position = Vector3.MoveTowards(TR.position, targetPos, TT)
            if(TT <= 0) break
        }

        this.isBlockMoving = false
        this.Penetration(0)

        for(let i = 0; i < this.BlockGroup.transform.childCount-1; i++){
            if(this.BlockGroup.transform.GetChild(i).CompareTag("AddBall")) continue
            if(this.BlockGroup.transform.GetChild(i).transform.position.y < -5.4){
                this.GM.beforeGameover = true
                break;
            }
            else 
            {
                this.GM.beforeGameover = false
                break;
            }
        }
        
    }

    Penetration(num: int){
        
        if(num == 1)
        {
            for(let i = this.BlockGroup.transform.childCount - 1; i >= 0; i--){
                var son = this.BlockGroup.transform.GetChild(i)
                if(son.CompareTag("Block")) this.BlockGroup.transform.GetChild(i).GetComponent<BoxCollider>().isTrigger = true
                else continue
            }
        }
        else {
            for(let i = this.BlockGroup.transform.childCount - 1; i >= 0; i--){
                var son = this.BlockGroup.transform.GetChild(i)
                if(son.CompareTag("Block")) this.BlockGroup.transform.GetChild(i).GetComponent<BoxCollider>().isTrigger = false
                else continue
            }
        }
        
    }

    WolfSelect(){
        this.wolf_skill_ing = true
        let v = 0
        for(let i = 0; i < this.BlockGroup.transform.childCount-1; i++){
            if(this.BlockGroup.transform.GetChild(i).CompareTag("AddBall")) continue
            else {
                if(this.BlockGroup.transform.GetChild(i) == null) continue
                this.BlockGroup.transform.GetChild(i).GetComponent<Block>().isSelected = true
                v++
                if(v >= this.BlockGroup.transform.childCount/5)
                {
                    this.GM.Breaking.Invoke(99999999)
                    break;
                }
                
            }
        }
        this.StartCoroutine(this.RevertMain())
    }

    *RevertMain(){
        yield null;
        this.wolf_skill_ing = false
        this.Spawn()
    }

    spcCount(num: int)
    {
        if(this.spcScore >= this.spcReq){
            this.spcScore -= this.spcReq
            this.isSpcSpawning = true
        }
        this.spcScore += this.GM.scoreAddValue
    }

    AddBall(pos: GameObject)
    {
        for(let i = 0; i < this.BlockGroup.transform.childCount-1; i++){
            if(this.BlockGroup.transform.GetChild(i).CompareTag("AddBall")) continue
            if(this.BlockGroup.transform.GetChild(i).transform.position.y < -5.4){
                this.GM.beforeGameover = true
                break;
            }
            else 
            {
                this.GM.beforeGameover = false
                break;
            }
        }

        for(let i = 0; i < this.GM.addingCount; i++)
        {
            var obj = Object.Instantiate(this.main_Ball, pos.transform.position, this.QI, this.BallGroup.transform)
        }
    }
}