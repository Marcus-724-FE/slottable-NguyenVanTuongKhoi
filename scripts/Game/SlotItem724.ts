import { _decorator, Color, Component, Node, Sprite, tween } from 'cc';
import { SymbolType } from '../Core/Interface724';
import { DataManager } from '../Core/DataManager724';
import { EventManager, EventType } from '../Core/EventManager724';

const { ccclass, property } = _decorator;

@ccclass('SlotItem')
export class SlotItem extends Component {
    @property(Sprite) spriteRenderer: Sprite = null;

    static normalColor: Color = Color.WHITE;
    static dimmedColor: Color = Color.GRAY;

    private x: number; // column index
    private y: number; // row index

    onLoad() {
        EventManager.emitter.on(EventType.START_SPIN, () => {
            this.SetDim(true);
        });

        EventManager.emitter.on(EventType.SHOW_PAYLINE, (payline: number[]) => {
            let isWin = this.IsInPayline(payline);
            this.SetDim(isWin);
        })
    }

    Init(column: number, row: number) {
        this.x = column;
        this.y = row
    }

    SetRender(type: SymbolType) {
        // Render texture
        var spriteFrame = DataManager.Instance.getSlotData(type);
        this.spriteRenderer.spriteFrame = spriteFrame;
    }

    SetDim(isWin: boolean) {
        let color = isWin ? SlotItem.normalColor : SlotItem.dimmedColor;
        this.spriteRenderer.color = color;
    }

    IsInPayline(payline: number[]) {
        return payline[this.x] == this.y;
    }
}

