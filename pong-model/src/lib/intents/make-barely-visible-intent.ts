import { GameIntent, Player, SomeGameIntent } from '../types';

export const MAKE_BARELY_VISIBLE_INTENT = 8;

export type MakeBarelyVisibleIntent = GameIntent<typeof MAKE_BARELY_VISIBLE_INTENT, Player>;

export function createMakeBarelyVisibleIntent(player: Player): MakeBarelyVisibleIntent {
    return {
        type: MAKE_BARELY_VISIBLE_INTENT,
        payload: player
    };
}

export function isMakeBarelyVisibleIntent(intent: SomeGameIntent): intent is MakeBarelyVisibleIntent {
    return intent.type === MAKE_BARELY_VISIBLE_INTENT;
}