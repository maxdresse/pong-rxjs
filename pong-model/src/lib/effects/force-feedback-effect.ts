import { GameEffect, Player } from '../types';

export function createForceFeedbackEffect(playerWithFeedback: Player): GameEffect {
    return {
        apply: ({  }) => {
            console.log('hard hit');
        }
    };
}