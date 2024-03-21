import { getPlayerDisplayName } from '../render/user-message-utils';
import { GameEffect, Player, UserMessageType } from '../types';

export function createPlayerWinsEffect(winningPlayer: Player): GameEffect {
    return {
        apply: ({ params }) => {
            params.paused = true;
            params.userMessage = {
                type: UserMessageType.BOTH,
                msg: `${getPlayerDisplayName(winningPlayer)} Wins!`,
                flashing: true,
            }
        }
    };
}