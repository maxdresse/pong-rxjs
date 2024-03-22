import { GameEffect, Player, Score } from '../types';

export function createIncrementScoreEffect(scoringPlayer: Player): GameEffect {
    return {
        apply: ({ score, params }) => {
            // cpy
            const tmp = JSON.parse(JSON.stringify(score.playerToScore)) as Score["playerToScore"];
            // mutate
            if (score.playerToScore[scoringPlayer] + 1 < params.goalsToWin) {
                // goes on
                tmp[scoringPlayer]++;
                params.scoreProgress.unshift(scoringPlayer);
            } else {
                // game end
                tmp[Player.PLAYER1] = 0;
                tmp[Player.PLAYER2] = 0;
                params.scoreProgress.length = 0;
            }
            // set
            score.playerToScore = tmp;
        }
    };
}