import { GameIntent, SomeGameIntent } from '../types';

export const TOGGLE_THEME_INTENT = 21;

export type ToggleThemeIntent = GameIntent<typeof TOGGLE_THEME_INTENT, void>;

export function createToggleThemeIntent(): ToggleThemeIntent {
    return {
        type: TOGGLE_THEME_INTENT,
        payload: undefined
    };
}

export function isToggleThemeIntent(intent: SomeGameIntent): intent is ToggleThemeIntent {
    return intent.type === TOGGLE_THEME_INTENT;
}