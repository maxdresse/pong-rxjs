import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { getMsgType } from '../render/user-message-utils';
import { GameEffect, GameSituation, Player } from '../types';

export function createInvertControlsEffect(player: Player, duration = DEFAUL_MUTATION_DURATION):  GameEffect {
    return {
        apply: ({ params }: GameSituation) => {
            params.control[player].inverted = true;
            params.userMessage = {
                type: getMsgType(player),
                flashing: true,
                msg: 'Invert Controls'
            }
            setTimeout(() => {
                params.userMessage = undefined;
            }, 3000);
            setTimeout(() => {
                params.control[player].inverted = false;
            }, duration)
        }
    }
};
