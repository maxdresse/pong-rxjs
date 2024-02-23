import { Observable } from 'rxjs';
import { Score } from './types';
import { createObsValue } from './obs-value';

export function createInitialScore(): [Score, Observable<Score["playerToScore"]>] {
    const initialVal = [0, 0];
    return createObsValue("playerToScore", initialVal) as unknown as [Score, Observable<Score["playerToScore"]>]; 
}