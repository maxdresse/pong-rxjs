import { Score } from './types';

export function createInitialScore(): Score {
    return {
      goalsToWin: 5,
      playerToScore: [0, 0]  
    };
}