import { _decorator, SpriteFrame, Enum } from 'cc';

const { ccclass, property } = _decorator;

export interface IResult {
    Symbols: number[][], // 5x4 Symbols 
    Paylines: number[][], // list of index
}

export enum SymbolType {
    Symbol_J,
    Symbol_Q,
    Symbol_K,
    Symbol_Coin,
}

@ccclass('SlotData')
export class SlotData {
    @property({ type: Enum(SymbolType) }) itemType: SymbolType = SymbolType.Symbol_J;
    @property(SpriteFrame) texture: SpriteFrame = null;
}