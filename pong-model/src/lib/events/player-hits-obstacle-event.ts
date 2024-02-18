import { GameEvent, Player, SomeGameEvent } from '../types';

export const PLAYER_HITS_OBSTACLE_EVENT = 100;

export interface PlayerHitsObstaclePayload {
    player: Player;
};

type PlayerHitsObstacleEvent = GameEvent<typeof PLAYER_HITS_OBSTACLE_EVENT, PlayerHitsObstaclePayload>;

export function createPlayerHitsObstacleEvent(player: Player): PlayerHitsObstacleEvent {
    return {
        type: PLAYER_HITS_OBSTACLE_EVENT,
        payload: { player }
    };
} 

export function isPlayerHitsObstacleEvent(ev: SomeGameEvent): ev is PlayerHitsObstacleEvent {
    return ev.type === PLAYER_HITS_OBSTACLE_EVENT;
}