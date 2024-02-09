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

export interface IUserInputEvent {
    // should support arrow keys
}

export interface IUserInput {
    events$: Observable<IUserInputEvent>;
}

export interface IScore {
    player1: number;
    player2: number;
}

export interface IGame {
    objects$: Observable<Array<IObj>>;
    tearDown: () => void;
}

export enum GameControlAction {
    RUN,
    PAUSE
}

export interface IGameControl {
    actions$: Observable<GameControlAction>;
}

export interface GameIntent<T extends number, P> {
    type: T;
    payload: P;
};


export interface GameSituation {
    playerBodies: [b2Body, b2Body];
}

export interface GameEffect<P> {
    apply(sn: GameSituation, payload: P): void;
}

export interface IGameDef {
    control: IGameControl;
    userInput1: IUserInput;
    userInput2: IUserInput;
    canvas: HTMLCanvasElement;
    zoomFactor?: number;
}

export type GameFactory = (def: IGameDef) => IGame; 