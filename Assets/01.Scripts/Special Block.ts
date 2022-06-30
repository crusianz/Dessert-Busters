import { Mathf } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Block from './Block';

export default class SpecialBlock extends Block {

    public isSpecial: bool 
    height_list: int[] = [2,2]
    width_list: int[] = [2,2]
    public height
    public width

    Start():void{
        this.isSpecial = true
        super.Start()
        this.type = 0
        this.hp = Mathf.RoundToInt(this.GM.layer * 2.5)
    }

}