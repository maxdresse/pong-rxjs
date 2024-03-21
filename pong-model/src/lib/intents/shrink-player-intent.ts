import { GameIntent, Player, SomeGameIntent } from '../types';

export const SHRINK_PLAYER_INTENT = 18;

export type ShrinkPlayerIntent = GameIntent<typeof SHRINK_PLAYER_INTENT, Player>;

export function createShrinkPlayerIntent(player: Player): ShrinkPlayerIntent {
    return {
        type: SHRINK_PLAYER_INTENT,
        payload: player
    };
}

export function isShrinkPlayerIntent(intent: SomeGameIntent): intent is ShrinkPlayerIntent {
    return intent.type === SHRINK_PLAYER_INTENT;
}