import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from
    'ZEPETO.Character.Controller'
import {WorldService } from 'ZEPETO.World';
import { Vector3 } from 'UnityEngine';
import { Scene } from 'UnityEngine.SceneManagement';

export default class CharacterControllerSample extends ZepetoScriptBehaviour {
    Start() {

        var spawninfo = new SpawnInfo()
        spawninfo.position = this.gameObject.transform.position
        ZepetoPlayers.instance.CreatePlayerWithZepetoId("huh00833", spawninfo,true);

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            let _player: LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
            ZepetoPlayers.instance.ZepetoCamera.gameObject.SetActive(false)
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localScale = new Vector3(4, 4, 4)
        });
        
    }
}