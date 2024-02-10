import { createMovePlayerEffect } from './effects/move-player-effect';
import { isMovePlayerIntent } from './intents/player-control-intents';
import { GameLogic, IGameDef } from './types';

const defaultGameLogic: GameLogic = {
    intentResponder: (intent) => {
        if (isMovePlayerIntent(intent)) {
            return createMovePlayerEffect(intent.payload) ;
        }
        throw Error('unknown intent');
    }
};

export function getGameLogic(def: IGameDef) {
    return def.gameLogic ?? defaultGameLogic;
}
