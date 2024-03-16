import { GameIntent, Player, SomeGameIntent } from '../types';

export const ENLARGE_PLAYER_INTENT = 21;

export type EnlargePlayerIntent = GameIntent<typeof ENLARGE_PLAYER_INTENT, Player>;

export function createEnlargePlayerIntent(player: Player): EnlargePlayerIntent {
    return {
        type: ENLARGE_PLAYER_INTENT,
        payload: player
    };
}

export function isEnlargePlayerIntent(intent: SomeGameIntent): intent is EnlargePlayerIntent {
    return intent.type === ENLARGE_PLAYER_INTENT;
}