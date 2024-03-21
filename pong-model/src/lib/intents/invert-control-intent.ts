import { GameIntent, Player, SomeGameIntent } from '../types';

export const INVERT_CONTROLS_INTENT = 7;

export type InvertControlsIntent = GameIntent<typeof INVERT_CONTROLS_INTENT, Player>;

export function createInvertControlsIntent(player: Player): InvertControlsIntent {
    return {
        type: INVERT_CONTROLS_INTENT,
        payload: player
    };
}

export function isInvertControlsIntent(intent: SomeGameIntent): intent is InvertControlsIntent {
    return intent.type === INVERT_CONTROLS_INTENT;
}