import { createMovePlayerEffect } from './effects/move-player-effect';
import { isMovePlayerIntent } from './intents/player-control-intents';
import { GameLogic } from './types';

export const defaultGameLogic: GameLogic = {
    intentResponder: (intent) => {
        if (isMovePlayerIntent(intent)) {
            return createMovePlayerEffect(intent.payload) ;
        }
        throw Error('unknown intent');
    }
}