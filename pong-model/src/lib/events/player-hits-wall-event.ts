import { GameEvent, Player, SomeGameEvent } from '../types';

export const PLAYER_HITS_WALL_EVENT = 100;

export interface PlayerHitsWallPayload {
    player: Player;
};

type PlayerHitsWallEvent = GameEvent<typeof PLAYER_HITS_WALL_EVENT, PlayerHitsWallPayload>;

export function createPlayerHitsWallEvent(player: Player): PlayerHitsWallEvent {
    return {
        type: PLAYER_HITS_WALL_EVENT,
        payload: { player }
    };
} 

export function isPlayerHitsWallEvent(ev: SomeGameEvent): ev is PlayerHitsWallEvent {
    return ev.type === PLAYER_HITS_WALL_EVENT;
}