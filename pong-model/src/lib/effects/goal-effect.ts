import { otherPlayer } from '../player-utils';
import { GameEffect, Player } from '../types';

export function createGoalEffect(playerWhoseGoalWasHit: Player): GameEffect {
    return {
        apply: (gameSituation) => {
            const playerToScore = gameSituation.score.playerToScore;
            const playerWhoScored = otherPlayer(playerWhoseGoalWasHit);
            playerToScore[playerWhoScored]++;
        }
    };
}