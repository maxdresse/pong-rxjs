import { GameParameters } from './types';
import { defaultPositionIterations, defaultVelocityIterations } from './physical-constants';
import { defaultZoom } from './render-constants';
import { defaultTimeStep } from './physical-constants';

export function getDefaultParameters(): GameParameters {
    return {
        zoomFactor: defaultZoom,
        paused: false,
        positionIterations: defaultPositionIterations,
        velocityIterations: defaultVelocityIterations,
        timeStep: defaultTimeStep
    };
}
