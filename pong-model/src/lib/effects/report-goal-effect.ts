import { GameEffect, Player  } from '../types';
import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { getMsgType } from '../render/user-message-utils';

export function createReportGoalEffect(scoringPlayer: Player, duration = DEFAUL_MUTATION_DURATION): GameEffect {
    return {
        apply: ({ params }) => {
            params.userMessage = {
                msg: 'Goal!',
                type: getMsgType(scoringPlayer)
            }
            setTimeout(() => {
                params.userMessage = undefined;
            }, duration)
        }
    };
}
