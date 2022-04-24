import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from
    'ZEPETO.Character.Controller'

export default class CharacterControllerSample extends ZepetoScriptBehaviour {
    Start() {
        ZepetoPlayers.instance.CreatePlayerWithZepetoId("", "huh00833", new SpawnInfo(),
            true);

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            let _player: LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
        });
    }
}