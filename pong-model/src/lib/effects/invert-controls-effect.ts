import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { showFlashingMsgToPlayer } from '../render/user-message-utils';
import { scheduleRevertFct } from '../schedule-revert-fct';
import { GameEffect, GameSituation, Player } from '../types';

export function createInvertControlsEffect(player: Player, duration = DEFAUL_MUTATION_DURATION):  GameEffect {
    return {
        apply: ({ params }: GameSituation) => {
            params.control[player].inverted = true;
            showFlashingMsgToPlayer('Invert Controls!', player, params);
            scheduleRevertFct(() => {
                params.control[player].inverted = false;
            }, duration, params.revertEffectFcts);
        }
    }
};
