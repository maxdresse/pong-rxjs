import { GameIntent, SomeGameIntent } from '../types';

export const PAUSE_INTENT = 14;

export type PauseIntent = GameIntent<typeof PAUSE_INTENT, void>;

export function createPauseIntent(): PauseIntent {
    return {
        type: PAUSE_INTENT,
        payload: undefined
    };
}

export function isPauseIntent(intent: SomeGameIntent): intent is PauseIntent {
    return intent.type === PAUSE_INTENT;
}

export const PLAY_INTENT = 15;

export type PlayIntent = GameIntent<typeof PLAY_INTENT, void>;

export function createPlayIntent(): PlayIntent {
    return {
        type: PLAY_INTENT,
        payload: undefined
    };
}

export function isPlayIntent(intent: SomeGameIntent): intent is PlayIntent {
    return intent.type === PLAY_INTENT;
}