import { GameIntent, HandicapType, Player, SomeGameIntent } from '../types';

export const HANDICAP_INTENT = 8;

export interface HandicapPayload {
    handicappedPlayer: Player;
    type: HandicapType;
}

export type HandicapIntent = GameIntent<typeof HANDICAP_INTENT, HandicapPayload>;

export function createHandicapIntent(handicappedPlayer: Player, type: HandicapType): HandicapIntent {
    return {
        type: HANDICAP_INTENT,
        payload: {
            handicappedPlayer,
            type
        }
    };
}

export function isHandicapIntent(intent: SomeGameIntent): intent is HandicapIntent {
    return intent.type === HANDICAP_INTENT;
}