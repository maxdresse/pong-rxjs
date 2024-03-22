import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { getMsgType, showFlashingMsgToPlayer, showShortMessage } from '../render/user-message-utils';
import { GameEffect, GameSituation, Player } from '../types';

export function createInvertControlsEffect(player: Player, duration = DEFAUL_MUTATION_DURATION):  GameEffect {
    return {
        apply: ({ params }: GameSituation) => {
            params.control[player].inverted = true;
            showFlashingMsgToPlayer('Invert Controls', player, params)
            setTimeout(() => {
                params.control[player].inverted = false;
            }, duration)
        }
    }
};
