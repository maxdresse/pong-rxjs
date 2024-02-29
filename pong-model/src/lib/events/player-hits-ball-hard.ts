import { GameEvent, Player, SomeGameEvent } from '../types';

export const HIT_BALL_HARD_EVENT = 102;

export interface HitBallHardPayload {
    player: Player;
};

type HitBallHardEvent = GameEvent<typeof HIT_BALL_HARD_EVENT, HitBallHardPayload>;

export function createHitBallHardEvent(player: Player): HitBallHardEvent {
    return {
        type: HIT_BALL_HARD_EVENT,
        payload: { player }
    };
} 

export function isHitBallHardEvent(ev: SomeGameEvent): ev is HitBallHardEvent {
    return ev.type === HIT_BALL_HARD_EVENT;
}