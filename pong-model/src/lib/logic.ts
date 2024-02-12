import { createBigPlayerSlowdownEffect } from './effects/big-player-slowdown-effect';
import { createMovePlayerEffect } from './effects/move-player-effect';
import { isPlayerHitsWallEvent } from './events/player-hits-wall-event';
import { isMovePlayerIntent } from './intents/player-control-intents';
import { GameLogic, IGameDef } from './types';

const defaultGameLogic: GameLogic = {
    intentResponder: (intent) => {
        if (isMovePlayerIntent(intent)) {
            return createMovePlayerEffect(intent.payload) ;
        }
        throw Error('unknown intent');
    },
    eventResponder: (event) => {
        if (isPlayerHitsWallEvent(event)) {
            return createBigPlayerSlowdownEffect({ player: event.payload.player });
        }
        throw Error('unknown event');
    }
};

export function getGameLogic(def: IGameDef) {
    return def.gameLogic ?? defaultGameLogic;
}
