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

export interface EffectContext {}

export type EffectFactory = (ctx: EffectContext) => GameEffect;

export interface IGameDef {
    effectFactories: Array<EffectFactory>;
    canvas: HTMLCanvasElement;
    zoomFactor?: number;
}

export type GameFactory = (def: IGameDef) => IGame; 