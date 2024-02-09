import { b2Body } from '@box2d/core';
import { Observable } from 'rxjs';

export const enum Player {
    PLAYER1 = 0,
    PLAYER2 = 1
} ;

export interface Vc2 {
    x: number;
    y: number;
}

export interface IObj {
    pos: Vc2;
}

export interface IScore {
    playerToScore: [number, number];
}

export interface IGame {
    objects$: Observable<Array<IObj>>;
    tearDown: () => void;
}

export interface GameIntent<T extends number, P> {
    type: T;
    payload: P;
};

export type SomeGameIntent = GameIntent<number, unknown>;

export interface GameSituation {
    playerBodies: [b2Body, b2Body];
}

export interface GameEffect {
    apply(sn: GameSituation): void;
}

export interface EffectContext {
    gameSituation: GameSituation;
}

export type InputFactory = (ctx: { onFrame$: Observable<void> }) => Observable<SomeGameIntent>;

export interface IntentResponder {
    toEffect(intent: SomeGameIntent): GameEffect;
}

export interface GameEvent {

}

export interface EventResponder {
    toIntent(event: GameEvent): SomeGameIntent;
}

export interface GameLogic {
    intentResponder: IntentResponder;
    eventResponder: EventResponder;
}

export interface IGameDef {
    canvas: HTMLCanvasElement;
    inputFactory?: InputFactory;
    gameLogic?: GameLogic;
    zoomFactor?: number;
}

export type GameFactory = (def: IGameDef) => IGame; 