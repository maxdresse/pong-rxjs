import { GameEvent, Player, SomeGameEvent } from '../types';

export const GOAL_SCORED_EVENT = 101;

export interface GoalScoredPayload {
    player: Player;
};

type GoalScoredEvent = GameEvent<typeof GOAL_SCORED_EVENT, GoalScoredPayload>;

export function createGoalScoredEvent(player: Player): GoalScoredEvent {
    return {
        type: GOAL_SCORED_EVENT,
        payload: { player }
    };
} 

export function isGoalScoredEvent(ev: SomeGameEvent): ev is GoalScoredEvent {
    return ev.type === GOAL_SCORED_EVENT;
}