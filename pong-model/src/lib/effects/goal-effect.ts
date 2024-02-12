import { otherPlayer } from '../player-utils';
import { GameEffect, Player } from '../types';

export function createGoalEffect(playerWhoseGoalIsHit: Player): GameEffect {
    return {
        apply: (gameSituation) => {
            const playerToScore = gameSituation.score.playerToScore;
            const playerWhoScored = otherPlayer(playerWhoseGoalIsHit);
            playerToScore[playerWhoScored]++;
        }
    };
}