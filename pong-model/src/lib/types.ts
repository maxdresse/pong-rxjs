import { b2Body } from '@box2d/core';
import { Observable } from 'rxjs';

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


export interface GameSnapshot {
    player1Body: b2Body;
}

export interface GameEffect {
    apply(sn: GameSnapshot): void;
}

export interface IGameDef {
    control: IGameControl;
    userInput1: IUserInput;
    userInput2: IUserInput;
    canvas: HTMLCanvasElement;
    zoomFactor?: number;
}

export type GameFactory = (def: IGameDef) => IGame; 