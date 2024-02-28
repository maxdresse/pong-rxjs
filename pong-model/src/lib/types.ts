import { b2Body, b2World } from '@box2d/core';
import { Observable } from 'rxjs';

export interface IRenderer {
    draw(world: b2World): void;   
}

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

export interface IGame {
    objects$: Observable<Array<IObj>>;
    tearDown: () => void;
}

export interface GameIntent<T extends number, P> {
    type: T;
    payload: P;
};

export type SomeGameIntent = GameIntent<number, unknown>;

export type GameObjectType = 'goal' | 'wall' | 'player' | 'ball';

export interface Score {
    playerToScore: [number, number];
}

export interface GameSituation {
    playerBodies: [b2Body, b2Body];
    ballBody: b2Body;
    params: GameParameters;
    score: Score;
}

export interface GameEffect {
    apply(sn: GameSituation): void;
}

export type InputFactory = (ctx: { onFrame$: Observable<void> }) => Observable<SomeGameIntent>;

export type IntentResponder = (intent: SomeGameIntent) => GameEffect | Array<GameEffect>;

export interface GameEvent<T extends number, P> {
    type: T;
    payload: P;
};

export type SomeGameEvent = GameEvent<number, unknown>;

export type EventResponder = (event: SomeGameEvent) => GameEffect | Array<GameEffect>;

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
    colorScheme: IColorScheme;
    goalsToWin: number;
}

export interface IGameDef {
    canvas: HTMLCanvasElement;
}

export type GameFactory = (def: IGameDef) => IGame; 

export interface IFillStroke {
    fill: string;
    stroke: string;
}

export interface IColorScheme {
    background: string;
    ball: IFillStroke;
    player: IFillStroke;
    fence: IFillStroke;
    wall: string;
    text: string;
}

export interface UIData     {
    score$: Observable<Score['playerToScore']>;
    params: GameParameters;
    onUiIntent(intent: SomeGameIntent): void
}