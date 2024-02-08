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

export interface IMatch {
    objects$: Observable<Array<IObj>>;
    tearDown: () => void;
}

export enum MatchControlAction {
    RUN,
    PAUSE
}

export interface IMatchControl {
    actions$: Observable<MatchControlAction>;
}


// todo GameIntent and GameEffects!

export interface IMatchDef {
    control: IMatchControl;
    userInput1: IUserInput;
    userInput2: IUserInput;
    canvas: HTMLCanvasElement;
    zoomFactor?: number;
}

export type MatchFactory = (def: IMatchDef) => IMatch; 