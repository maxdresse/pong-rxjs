import { GameParameters } from './types';
import { DEFAULT_POS_ITERATIONS, DEFAULT_VEL_ITERATIONS } from './physical-constants';
import { defaultZoom } from './render-constants';
import { DEFAULT_TIME_STEP } from './physical-constants';

export function getDefaultParameters(): GameParameters {
    return {
        zoomFactor: defaultZoom,
        paused: false,
        positionIterations: DEFAULT_POS_ITERATIONS,
        velocityIterations: DEFAULT_VEL_ITERATIONS,
        timeStep: DEFAULT_TIME_STEP
    };
}
