import { GameIntent, Player, SomeGameIntent } from '../types';

export const SPINNING_INTENT = 19;

export type SpinningIntent = GameIntent<typeof SPINNING_INTENT, Player>;

export function createSpinningIntent(player: Player): SpinningIntent {
    return {
        type: SPINNING_INTENT,
        payload: player
    };
}

export function isSpinningIntent(intent: SomeGameIntent): intent is SpinningIntent {
    return intent.type === SPINNING_INTENT;
}