import { createPlayerSlowdownEffect } from './effects/player-slowdown-effect';
import { createMovePlayerEffect } from './effects/move-player-effect';
import { isPlayerHitsObstacleEvent } from './events/player-hits-obstacle-event';
import { isMovePlayerIntent } from './intents/player-control-intents';
import { GameEvent, GameLogic, GameParameters, IGameDef, Player, Score } from './types';
import { GoalScoredPayload, isGoalScoredEvent } from './events/goal-scored-event';
import { createKickoffEffect } from './effects/kickoff-effect';
import { otherPlayer } from './player-utils';
import { createChangeScoreEffect } from './effects/change-score-effect';
import { createPlayerWinsEffect } from './effects/player-wins-effect';
import { isPauseIntent, isPlayIntent } from './intents/play-pause-intent';
import { createPauseEffect, createPlayEffect } from './effects/play-pause-effect';
import { isToggleThemeIntent } from './intents/toggle-theme-intent';
import { createToggleThemeEffect } from './effects/toggle-theme-effect';
import { isHitBallHardEvent } from './events/player-hits-ball-hard';
import { createForceFeedbackEffect } from './effects/force-feedback-effect';
import { createResetPlayersEffect } from './effects/reset-players-effect';



interface GameLogitInit {
    score: Score;
    params: GameParameters;
}

export function createGameLogic({ score, params }: GameLogitInit): GameLogic {
    return {
        intentResponder: (intent) => {
            if (isMovePlayerIntent(intent)) {
                return createMovePlayerEffect(intent.payload) ;
            } else if (isPauseIntent(intent)) {
                return createPauseEffect();
            } else if (isPlayIntent(intent)) {
                return createPlayEffect();
            } else if (isToggleThemeIntent(intent)) {
                return createToggleThemeEffect();
            }
            throw Error('unknown intent');
        },
        eventResponder: (event) => {
            if (isPlayerHitsObstacleEvent(event)) {
                return createPlayerSlowdownEffect({ player: event.payload.player });
            } else if (isGoalScoredEvent(event)) {
                return handleGoal(event, score, params);
            } else if (isHitBallHardEvent(event)) {
                return createForceFeedbackEffect(event.payload.player);
            }
            throw Error('unknown event');
        }
    };
}
function handleGoal(event: GameEvent<101, GoalScoredPayload>, score: Score, params: GameParameters) {
    const scoringPlayer = otherPlayer(event.payload.player);
    const pToScore = score.playerToScore;
    if (pToScore[scoringPlayer] + 1 < params.goalsToWin) {
        // case game goes on
        return [createChangeScoreEffect(p2s => p2s[scoringPlayer]++), createKickoffEffect(scoringPlayer)];
    }
    // case player wins
    return [
        createChangeScoreEffect(p2s => {
            p2s[Player.PLAYER1] = 0;
            p2s[Player.PLAYER2] = 0;
        }),
        createKickoffEffect(scoringPlayer),
        createPlayerWinsEffect(scoringPlayer),
        createResetPlayersEffect(),
    ];
}

