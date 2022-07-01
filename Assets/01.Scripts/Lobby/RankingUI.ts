import { GameObject, Object, Quaternion, Random, Vector3 } from 'UnityEngine'
import { Result } from 'UnityEngine.Networking.UnityWebRequest';
import {Button, Text} from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GetRangeRankResponse, LeaderboardAPI, ResetRule, SetScoreResponse } from 'ZEPETO.Script.Leaderboard'

export default class RankingUI extends ZepetoScriptBehaviour {

    public leaderboardID: string
    startrank: int
    endrank: int
    resetrule: ResetRule
    contentbase: GameObject
    parents: GameObject

    Start() {    
        LeaderboardAPI.SetScore(this.leaderboardID, Random.Range(30, 3300), this.Success)
        LeaderboardAPI.GetRangeRank(this.leaderboardID, this.startrank, this.endrank, this.resetrule, false, (result: GetRangeRankResponse)=>{
            let yValue = 0
            if(result.rankInfo.myRank) console.log(result.rankInfo.rankList)


            if(result.rankInfo.rankList){
                for (let i = 0; i < result.rankInfo.rankList.length; ++i) {
                    var rank = result.rankInfo.rankList.get_Item(i);
                    Object.Instantiate(this.contentbase, new Vector3(0, yValue, 0), Quaternion.identity, this.parents.transform)
                    var content = this.parents.transform.GetChild(i)
                    content.transform.GetChild(0).GetComponent<Text>().text = rank.rank.toString()
                    content.transform.GetChild(1).GetComponent<Text>().text = rank.name
                    content.transform.GetChild(2).GetComponent<Text>().text = rank.score.toString()
                    yValue -= 1 
                }
            }
        } )
    }

    OnResult(result: GetRangeRankResponse){
        
    }

    Success(res: SetScoreResponse)
    {
        console.log(res.isSuccess)
    }        
    
}