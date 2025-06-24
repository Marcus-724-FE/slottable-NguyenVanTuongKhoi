import { EventTarget } from "cc";

export enum EventType {
    START_SPIN = "START_SPIN",
    END_SPIN = "END_SPIN",
    SHOW_PAYLINE = "SHOW_PAYLINE"
}

export class EventManager {
    public static emitter: EventTarget = new EventTarget();
}