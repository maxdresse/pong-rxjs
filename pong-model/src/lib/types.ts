import { b2Body, b2World } from '@box2d/core';
import { Observable } from 'rxjs';

export interface IGameDef {
    canvas: HTMLCanvasElement;
    stats?: {
        updateInterval$?: Observable<number>;
        recordsMaxBufferSize?: number;
    }
}

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
    stats$: Observable<GameStatistics>;
    tearDown: () => void;
}

export interface GameIntent<T extends number, P> {
    type: T;
    payload: P;
};

export type SomeGameIntent = GameIntent<number, unknown>;

export const enum GameObjectType {
    None = 0,
    Ball = 1,
    Player = 2,
    Goal = 4,
    Wall = 8,
    Fence = 16
};

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

export const enum UserMessageType {
    P1 = 1,
    P2,
    BOTH
}

export interface UserMessage {
    type: UserMessageType;
    msg: string;
}

export interface GameParameters {
    zoomFactor: number;
    paused: boolean;
    positionIterations: number;
    velocityIterations: number;
    timeStep: number;
    colorScheme: IColorScheme;
    goalsToWin: number;
    gamePadConfig: GamepadConfig;
    userMessage?: UserMessage;
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
    goal: string;
    text: string;
}

export interface UIData     {
    score$: Observable<Score['playerToScore']>;
    gamePadConfig$: Observable<GamepadConfig>;
    params: GameParameters;
    onUiIntent(intent: SomeGameIntent): void
}

export interface GamepadConfig {
    playerToGamePad: { [key in Player]: Gamepad | null };
}

export interface GetStatsConfig {
    // desired update interval in milliseconds
    updateInterval$: Observable<number>;
}

export type ValueType = object | string | number;

export type GameStatsRecord<V extends ValueType = ValueType> = Record<string, V>;
export interface GameStatsAttribute {
    label: string;
    id: string;
}

export interface GameStatistics {
    attributes: Array<GameStatsAttribute>;
    records: Array<GameStatsRecord>;
}

export interface StatsCollector {
    defineAttribute(attrId: string, label: string): void;
    beginRecord(): void;
    writeAttribute(attrId: string, v: ValueType): void;
    endRecord(): void;
    clearRecords(): void;
    getRecords(): GameStatistics['records'];
    getAttributes(): GameStatistics['attributes'];
}

export interface StatsLogger {
    log(situation: GameSituation): GameStatistics;
}

export enum HandicapType {
    OPPONENT_ENLARGED
}