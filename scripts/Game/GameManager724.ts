import { _decorator, Node, Component, Prefab, instantiate } from "cc";
import { SymbolType } from "../Core/Interface";
import { DataManager } from "../Core/DataManager";
import { EventManager, EventType } from "../Core/EventManaget";
import { Reel } from "./Reel";

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node) btnPlay: Node = null;
    @property(Node) reelContainer: Node = null;
    @property(Prefab) reelPrefab: Prefab = null;
    @property(Prefab) symbolPrefab: Prefab = null;

    public static Instance: GameManager = null;
    private columns: number = 5;
    private rows: number = 4;
    private _result: SymbolType[][];

    onLoad() {
        GameManager.Instance = this;

        this.btnPlay.on(Node.EventType.TOUCH_END, () => {
            this.startGame();
        });
    }

    start() {
        for (let i = 0; i < this.columns; i++) {
            let gameObject = instantiate(this.reelPrefab);
            this.reelContainer.addChild(gameObject);

            let reel = gameObject.getComponent(Reel);
            reel.setValue(i * 0.3, i);
        }
    }

    public getPrefabSlotItem() {
        return this.symbolPrefab;
    }

    public getGameResultByColumn(index: number) {
        return this._result[index];
    }

    startGame() {
        // Get result
        this._result = this.createResult();

        // Render result
        EventManager.emitter.emit(EventType.START_SPIN);
    }

    createResult() {
        const result: SymbolType[][] = [];

        for (let i = 0; i < this.columns; i++) {
            const columnResult: SymbolType[] = [];

            for (let j = 0; j < this.rows; j++) {
                let randomType = this.randomItemType();
                columnResult.push(randomType)
            }

            result.push(columnResult);
        }

        return result;
    }

    randomItemType() {
        let length = DataManager.Instance.slots.length;
        let random = Math.floor(Math.random() * length);
        let type = SymbolType[SymbolType[random]];
        return type;
    }
}