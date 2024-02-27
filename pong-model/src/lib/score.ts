import { Observable } from 'rxjs';
import { Score } from './types';
import { createObservableProperty } from './observable-property';

export function createInitialScore(): [Score, Observable<Score["playerToScore"]>] {
    const initialVal = [0, 0];
    return createObservableProperty("playerToScore", initialVal) as [Score, Observable<Score["playerToScore"]>]; 
}