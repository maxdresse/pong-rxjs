import { GameParameters } from './types';
import { DEFAULT_POS_ITERATIONS, DEFAULT_VEL_ITERATIONS } from './physical-constants';
import { DEFAULT_ZOOM } from './render/render-constants';
import { DEFAULT_TIME_STEP } from './physical-constants';
import { EIGHTIES_DARK_SCHEME } from './render/color-schemes/eighties';
import { createObservableProperty } from './observable-property';
import { Observable } from 'rxjs';

const GOALS_TO_WIN = 5;

export function getDefaultParameters(): GameParameters {
    return {
        ...{
        zoomFactor: DEFAULT_ZOOM,
        positionIterations: DEFAULT_POS_ITERATIONS,
        velocityIterations: DEFAULT_VEL_ITERATIONS,
        timeStep: DEFAULT_TIME_STEP,
        colorScheme: EIGHTIES_DARK_SCHEME,
        goalsToWin: GOALS_TO_WIN },
        ...getPausedState(false)
    };
}

function getPausedState(initialVal: boolean): { paused: boolean, paused$: Observable<boolean> } {
    const [obj, paused$] = createObservableProperty('paused', initialVal);
    // not working!!! getter setters are removed
    return Object.assign(obj, { paused$ });

}