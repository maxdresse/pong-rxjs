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


export interface GameSituation {
    playerBodies: [b2Body, b2Body];
}

export interface GameEffect {
    apply(sn: GameSituation): void;
}

export interface EffectContext {
    /* onFrame: Observable<void>;
    addTeardownLogic(logic: () => void): void; */
    gameSituation: GameSituation;
}

export interface EffectFactory {
    canHandle(intent: GameIntent<number, unknown>): boolean;
    create: (intent: GameIntent<number, unknown>, ctx: EffectContext) => GameEffect;
}

export interface IGameDef {
    canvas: HTMLCanvasElement;
    zoomFactor?: number;
}

// observable of intents
// for each intent, decide if a factory can handle it
// if so, create and apply effect

export type GameFactory = (def: IGameDef) => IGame; 