import { GameEffect, Player  } from '../types';
import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { getMsgType } from '../render/user-message-utils';

export function createReportGoalEffect(scoringPlayer: Player, duration = DEFAUL_MUTATION_DURATION): GameEffect {
    return {
        apply: ({ params }) => {
            const msgText = 'Goal!';
            params.userMessage = {
                msg: msgText,
                type: getMsgType(scoringPlayer)
            }
            setTimeout(() => {
                if (params.userMessage?.msg === msgText) {
                    params.userMessage = undefined;
                }
            }, duration)
        }
    };
}
