import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from
    'ZEPETO.Character.Controller'
import {WorldService} from 'ZEPETO.World';
import { Time, Vector3 } from 'UnityEngine';
import { Scene, SceneManager } from 'UnityEngine.SceneManagement';

export default class CharacterControllerSample extends ZepetoScriptBehaviour {

    canvas
    Start() {
        Time.timeScale = 1  
        var spawninfo = new SpawnInfo()
        spawninfo.position = this.gameObject.transform.position
        
        
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, spawninfo, true);

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            let _player: LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
            if(SceneManager.GetActiveScene().name == "Lobby") return
            ZepetoPlayers.instance.ZepetoCamera.gameObject.SetActive(false)
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localScale = new Vector3(4, 4, 4)
        });
        
    }
}