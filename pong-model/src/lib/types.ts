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
    params: GameParameters;
}

export interface GameEffect {
    apply(sn: GameSituation): void;
}

export type InputFactory = (ctx: { onFrame$: Observable<void> }) => Observable<SomeGameIntent>;

export type IntentResponder = (intent: SomeGameIntent) => GameEffect;

export interface GameEvent<T extends number, P> {
    type: T;
    payload: P;
};

export type SomeGameEvent = GameEvent<number, unknown>;


export type EventResponder = (event: SomeGameEvent) => GameEffect;

export interface GameLogic {
    intentResponder: IntentResponder;
    eventResponder: EventResponder;
}

export interface GameParameters {
    zoomFactor: number;
    paused: boolean;
    positionIterations: number;
    velocityIterations: number;
    timeStep: number;
}

export interface IGameDef {
    canvas: HTMLCanvasElement;
    inputFactory?: InputFactory;
    gameLogic?: GameLogic;
}

export type GameFactory = (def: IGameDef) => IGame; 