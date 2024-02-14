import { GameEffect, GameSituation } from '../types';

export function createChangeScoreEffect(playerToScore: GameSituation['score']['playerToScore']): GameEffect {
    return {
        apply: (gameSituation) => {
            gameSituation.score.playerToScore = playerToScore;
        }
    };
}