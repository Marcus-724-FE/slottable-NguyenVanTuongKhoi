import { _decorator, Component, instantiate, tween } from 'cc';
import { GameManager } from './GameManager724';
import { SlotItem } from './SlotItem724';
import { EventManager, EventType } from '../Core/EventManager724';
import { DataManager } from '../Core/DataManager724';

const { ccclass, property } = _decorator;

enum ReelState {
    Idle,
    LoopSpin,
    EndSpin,
}

@ccclass('Reel')
export class Reel extends Component {
    private static maxItem: number = 10;
    private static slotItemHeight = 110; // include spacing
    private static loopSpinTime = 3;
    private static speed = 1500;

    private endLoopTimestamp: number = 0;
    private state: ReelState = ReelState.Idle;
    private delay: number = 1;
    private columnIndex: number = 0;

    get IsLastColumn() {
        return this.columnIndex == 4;
    }

    onLoad() {
        EventManager.emitter.on(EventType.START_SPIN, () => {
            this.startSpin();
        });

        EventManager.emitter.on(EventType.END_SPIN, () => {
            this.state = ReelState.Idle;
        });
    }

    start() {
        this.initItems();
    }

    update(dt) {
        if (this.state == ReelState.LoopSpin) {
            let position = this.node.position.clone();
            position.y -= Reel.speed * dt;

            let maxPosY = -Reel.slotItemHeight * DataManager.Instance.getSymbolsLength();

            if (position.y <= maxPosY) {
                position.y -= maxPosY;

                if (Date.now() > this.endLoopTimestamp) {
                    this.showResult();
                }
            }

            this.node.position = position;
        }
    }

    setValue(delay: number, index: number) {
        this.delay = delay;
        this.columnIndex = index;
    }

    initItems() {
        var itemPrefab = GameManager.Instance.getPrefabSlotItem();
        var slotData = DataManager.Instance.slots;

        for (let i = 0; i < Reel.maxItem; i++) {
            let gameObject = instantiate(itemPrefab);
            gameObject.parent = this.node;

            let typeIndex = i % slotData.length;
            gameObject.getComponent(SlotItem).Init(slotData[typeIndex].itemType);
        }
    }

    public async startSpin() {
        if (this.state != ReelState.Idle) return;

        await new Promise(res => this.schedule(res, this.delay))

        this.endLoopTimestamp = Date.now() + Reel.loopSpinTime * 1000;
        this.state = ReelState.LoopSpin;
    }

    public showResult() {
        if (this.state != ReelState.LoopSpin) return;

        this.state = ReelState.EndSpin;

        let result = GameManager.Instance.getGameResultByColumn(this.columnIndex);

        for (let i = 0; i < result.length; i++) {
            let slotItem = this.node.children[i].getComponent(SlotItem)
            slotItem.Init(result[i]);
        }

        var position = this.node.position.clone();
        position.y = 0;

        tween(this.node).to(0.2, { position: position }).call(() => {
            if (this.IsLastColumn) {
                EventManager.emitter.emit(EventType.END_SPIN);
            }
        }).start();
    }
}

