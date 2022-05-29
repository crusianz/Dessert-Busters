import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from
    'ZEPETO.Character.Controller'
import { Vector3 } from 'UnityEngine';

export default class CharacterControllerSample extends ZepetoScriptBehaviour {
    Start() {

        var spawninfo = new SpawnInfo()
        spawninfo.position = this.gameObject.transform.position
        ZepetoPlayers.instance.CreatePlayerWithZepetoId("", "huh00833", spawninfo,
            true);

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            let _player: LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
        });
        ZepetoPlayers
    }
}