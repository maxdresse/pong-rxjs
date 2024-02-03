import { Observable } from 'rxjs';

export interface IObj {
    // position and velocity
}

export interface IUserInputEvent {
    // should support arrow keys
}

export interface IUserInput {
    events$: Observable<IUserInputEvent>;
} 

export interface IMatch {
    objects$: Observable<Array<IObj>>;
}

export interface IMatchDef {
    userInput1: IUserInput;
    userInput2: IUserInput;
}

export type MatchFactory = (def: IMatchDef) => IMatch; 