import { GameParameters } from './types';
import { DEFAULT_POS_ITERATIONS, DEFAULT_VEL_ITERATIONS } from './physical-constants';
import { DEFAULT_ZOOM } from './render/render-constants';
import { DEFAULT_TIME_STEP } from './physical-constants';
import { BLUEISH_SCHEME } from './render/color-schemes/blueish';

export function getDefaultParameters(): GameParameters {
    return {
        zoomFactor: DEFAULT_ZOOM,
        paused: false,
        positionIterations: DEFAULT_POS_ITERATIONS,
        velocityIterations: DEFAULT_VEL_ITERATIONS,
        timeStep: DEFAULT_TIME_STEP,
        colorScheme: BLUEISH_SCHEME
    };
}
