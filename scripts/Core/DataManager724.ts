import { _decorator, Component } from 'cc';
import { SymbolType, SlotData } from './Interface724';

const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    @property(SlotData) public slots: SlotData[] = [];

    public static Instance: DataManager = null;

    onLoad() {
        DataManager.Instance = this;
    }

    public getSlotData(type: SymbolType) {
        return this.slots.find(asset => asset.itemType == type).texture;
    }

    public getSymbolsLength() {
        return this.slots.length;
    }
}

