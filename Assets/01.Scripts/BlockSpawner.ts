import { GameObject, Object, Quaternion, Random, Time, Transform, Vector3, Mathf, Coroutine, WaitForSeconds } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager'
import Ball from './Ball'

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
public downPower: number
public QI: Quaternion
count: int

    Start() {
        this.GM = GameObject.FindGameObjectWithTag("MainCamera").GetComponent<GameManager>()
        this.Counting()
        this.Spawn()
        this.GM.Fall.AddListener(()=>this.Counting())
        this.GM.Fall.AddListener(()=>this.Spawn())
        this.GM.Down.AddListener((pos) => this.AddBall(pos))
        this.GM.ScoreUp.AddListener((num)=>this.spcCount(num))
        this.QI = Quaternion.Euler(0,0,0)
    }


    public Counting(){
        let tr: Transform = this.transform    
        for (let i = 0; i < 6; i++ ){ this.spawnList.push(new Vector3(tr.position.x + i * 1.8, tr.position.y, tr.position.z))}
        this.count = 0
        let randBl = Random.Range(0, 24)
        this.BlockCount = this.BlockGroup.transform.childCount
        //#region 특수블록 소환
        
        //#endregion
        if(this.BlockCount < 5) this.count = randBl < 16 ? 1 : 2
        else if(this.BlockCount > 4 && this.BlockCount < 15) this.count = randBl < 16 ? 2 : 3
        else if(this.BlockCount > 14 && this.BlockCount < 25) this.count = randBl < 12 ? 3 : 4
        else if(this.BlockCount > 24) this.count = randBl < 12 ? 5 : 6
        if(this.isSpcSpawning && this.count < 6){
            this.count += 1
        }
        
        
    }

    public Spawn(){
        var gameObj = this.p_block
        var spcObj = this.p_spcBlock[0]
        for (let i = 0; i < this.count; i++ ){
            var rand = Mathf.RoundToInt(Random.Range(0, this.spawnList.length-1))
            var pos = new Vector3(this.spawnList[rand].x, this.spawnList[rand].y, this.spawnList[rand].z)
            if(this.isSpcSpawning){
                var sObj = Object.Instantiate(spcObj, pos, Quaternion.Euler(0,0,0),this.BlockGroup.transform)    
                this.isSpcSpawning = false
            }
            var Obj = Object.Instantiate(gameObj, pos , Quaternion.Euler(0,0,0),this.BlockGroup.transform)
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
            console.log("upping")
            if(TR.position == targetPos + new Vector3(0, (this.downPower / 5), 0) || TT <= 0) break
        }

        TT = 0.2
        while(true){
            yield null
            TT -= Time.deltaTime
            TR.position = Vector3.MoveTowards(TR.position, targetPos, TT)
            console.log("downning")
            if(TT <= 0) break
        }
        this.isBlockMoving = false

    }

    spcCount(num: int)
    {
        if(this.spcScore >= 1000){
            this.spcScore -= 1000
            this.isSpcSpawning = true
        }
        this.spcScore += this.GM.scoreAddValue
    }

    AddBall(pos: GameObject)
    {
        for(let i = 0; i < this.GM.addingCount; i++)
        {
            var obj = Object.Instantiate(this.main_Ball, pos.transform.position, this.QI, this.BallGroup.transform)
        }
    }
}