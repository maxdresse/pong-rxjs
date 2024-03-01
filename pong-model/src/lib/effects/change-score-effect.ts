import { GameEffect, GameSituation } from '../types';

type PlayerToScore = GameSituation['score']['playerToScore'];

export function createChangeScoreEffect(scoreMutationFn: (playerToScore: PlayerToScore) => void): GameEffect {
    return {
        apply: (gameSituation) => {
            const enabled = gameSituation.ballBody.IsEnabled();
            if (!enabled) {
                return;
            }
            // cpy
            const tmp = JSON.parse(JSON.stringify(gameSituation.score.playerToScore));
            // mutate 
            scoreMutationFn(tmp);
            // set
            gameSituation.score.playerToScore = tmp;
        }
    };
}