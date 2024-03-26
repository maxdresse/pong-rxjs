import { GameParameters, Player } from './types';
import { DEFAULT_POS_ITERATIONS, DEFAULT_VEL_ITERATIONS } from './physical-constants';
import { DEFAULT_ZOOM } from './render/render-constants';
import { DEFAULT_TIME_STEP } from './physical-constants';
import { EIGHTIES_DARK_SCHEME } from './render/color-schemes/eighties';

const GOALS_TO_WIN = 5;

export function getDefaultParameters(): GameParameters {
    return {
        zoomFactor: DEFAULT_ZOOM,
        positionIterations: DEFAULT_POS_ITERATIONS,
        velocityIterations: DEFAULT_VEL_ITERATIONS,
        timeStep: DEFAULT_TIME_STEP,
        colorScheme: EIGHTIES_DARK_SCHEME,
        goalsToWin: GOALS_TO_WIN,
        paused: false,
        gamePadConfig: { playerToGamePad: [null, null] },
        control: {
            [Player.PLAYER1]: getDefaultControlParams(),
            [Player.PLAYER2]: getDefaultControlParams()
        },
        scoreProgress: [],
        revertEffectFcts: []
    };
}
function getDefaultControlParams(): { inverted: boolean; } {
    return {
        inverted: false
    };
}

