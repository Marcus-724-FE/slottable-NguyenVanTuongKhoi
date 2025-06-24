import { _decorator, Node, Component, Prefab, instantiate } from "cc";
import { IResult, SymbolType } from "../Core/Interface724";
import { DataManager } from "../Core/DataManager724";
import { EventManager, EventType } from "../Core/EventManager724";
import { Reel } from "./Reel724";
import { MockResult } from "./MockResult724";

const { ccclass, property } = _decorator;

enum GameState {
    Idle,
    Spinning,
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node) btnPlay: Node = null;
    @property(Node) reelContainer: Node = null;
    @property(Prefab) reelPrefab: Prefab = null;
    @property(Prefab) symbolPrefab: Prefab = null;

    public static Instance: GameManager = null;

    public columns: number = 5;
    public rows: number = 4;
    private _resultWithPaylines: IResult = null;
    private state: GameState = GameState.Idle;

    onLoad() {
        GameManager.Instance = this;

        this.btnPlay.on(Node.EventType.TOUCH_END, () => {
            this.startGame();
        });

        EventManager.emitter.on(EventType.END_SPIN, async () => {
            await new Promise(res => this.scheduleOnce(res, 0.25));

            await this.showAllPaylines();

            this.state = GameState.Idle
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
        return this._resultWithPaylines.Symbols[index];
    }

    async showAllPaylines() {
        let paylines = this._resultWithPaylines.Paylines;
        for (let i = 0; i < paylines.length; i++) {
            await this.showSinglePayline(paylines[i]);
        }
    }

    showSinglePayline(payline: number[]) {
        EventManager.emitter.emit(EventType.SHOW_PAYLINE, payline);

        return new Promise(res => this.scheduleOnce(res, 1.5));
    }

    startGame() {
        if (this.state != GameState.Idle) return;

        this.state = GameState.Spinning;

        // Get result
        this._resultWithPaylines = this.createResultWithPaylines();

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

    createResultWithPaylines() {
        let randomIndex = Math.floor(Math.random() * MockResult.Results.length);
        const result = MockResult.Results[randomIndex];

        console.log(result);

        return result;
    }

    randomItemType() {
        let length = DataManager.Instance.slots.length;
        let random = Math.floor(Math.random() * length);
        let type = SymbolType[SymbolType[random]];
        return type;
    }
}