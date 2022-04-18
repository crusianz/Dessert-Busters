import { Camera, GameObject, Rect, Screen } from 'UnityEngine'
import { ZepetoCamera, ZepetoPlayers } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class GameManger extends ZepetoScriptBehaviour {

    camera: Camera
    rect: Rect
    private ball: GameObject
    curScore: int
    spcScore: int
    normal_mob: int
    spc_mob: int
    screen_Scale: float[]

    Awake() {

        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(false);

        this.camera = Camera.main;
        this.rect = this.camera.rect;
        this.screen_Scale[0] = (Screen.width / Screen.height) / (9 / 16);
        this.screen_Scale[1] = 1 / this.screen_Scale[0];
        if (this.screen_Scale[0] < 1) {
            this.rect.height = this.screen_Scale[0];
            this.rect.y = (1 - this.screen_Scale[0]) / 2;
        }
        else
        {
            this.rect.width = this.screen_Scale[1];
            this.rect.x = (1 - this.screen_Scale[1]) / 2;
        }
        this.camera.rect = this.rect;

    }

    Start() {    

    }

}