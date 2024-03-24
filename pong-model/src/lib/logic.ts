import { createPlayerSlowdownEffect } from './effects/player-slowdown-effect';
import { createMovePlayerEffect } from './effects/move-player-effect';
import { isPlayerHitsObstacleEvent } from './events/player-hits-obstacle-event';
import { isMovePlayerIntent } from './intents/player-control-intents';
import { GameEvent, GameLogic, GameParameters, IGameDef, Player, Score } from './types';
import { GoalScoredPayload, isGoalScoredEvent } from './events/goal-scored-event';
import { createKickoffEffect } from './effects/kickoff-effect';
import { otherPlayer } from './player-utils';
import { createPlayerWinsEffect } from './effects/player-wins-effect';
import { isPauseIntent, isPlayIntent } from './intents/play-pause-intent';
import { createPauseEffect, createPlayEffect } from './effects/play-pause-effect';
import { isToggleThemeIntent } from './intents/toggle-theme-intent';
import { createToggleThemeEffect } from './effects/toggle-theme-effect';
import { isHitBallHardEvent } from './events/player-hits-ball-hard';
import { createForceFeedbackEffect } from './effects/force-feedback-effect';
import { createResetPlayersEffect } from './effects/reset-players-effect';
import { isEnlargePlayerIntent } from './intents/enlarge-player-intent';
import { createEnlargePlayerEffect } from './effects/enlarge-player-effect';
import { isMakeBarelyVisibleIntent } from './intents/make-barely-visible-intent';
import { createMakeBarelyVisibleEffect } from './effects/make-barely-visible-effect';
import { isShrinkPlayerIntent } from './intents/shrink-player-intent';
import { createShrinkPlayerEffect } from './effects/shrink-player-effect';
import { isInvertControlsIntent } from './intents/invert-control-intent';
import { createInvertControlsEffect } from './effects/invert-controls-effect';
import { getRandomHandicap } from './handicaps';
import { createIncrementScoreEffect } from './effects/increment-score-effect';
import { isSpinningIntent as isSpinningIntent } from './intents/spinning-intent';
import { createSpinningEffect } from './effects/spinning-effect';
import { createReportGoalEffect } from './effects/report-goal-effect';
import { REPORT_GOAL_DURATION } from './ui/ui-constants';

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
            } else if (isEnlargePlayerIntent(intent)) {
                return createEnlargePlayerEffect(intent.payload)
            } else if (isMakeBarelyVisibleIntent(intent)) {
                return createMakeBarelyVisibleEffect(intent.payload);
            } else if (isShrinkPlayerIntent(intent)) {
                return createShrinkPlayerEffect(intent.payload);
            } else if (isInvertControlsIntent(intent)) {
                return createInvertControlsEffect(intent.payload);
            } else if (isSpinningIntent(intent)) {
                return createSpinningEffect(intent.payload);
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
        const result = [
             createIncrementScoreEffect(scoringPlayer),
             createReportGoalEffect(scoringPlayer, REPORT_GOAL_DURATION),
             createKickoffEffect(scoringPlayer)
            ];
        const prg = params.scoreProgress;
        const getsHandicap = prg[0] === scoringPlayer && prg[1] === scoringPlayer;
        if (getsHandicap) {
            result.push(getRandomHandicap(scoringPlayer));
        }
        return result;
    }
    // case player wins
    return [
        createIncrementScoreEffect(scoringPlayer),
        createKickoffEffect(scoringPlayer),
        createPlayerWinsEffect(scoringPlayer),
        createResetPlayersEffect(),
    ];
}

