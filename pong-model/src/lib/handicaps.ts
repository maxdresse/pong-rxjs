import { createInvertControlsEffect } from './effects/invert-controls-effect';
import { createMakeBarelyVisibleEffect } from './effects/make-barely-visible-effect';
import { createShrinkPlayerEffect } from './effects/shrink-player-effect';
import { createSpinningEffect } from './effects/spinning-effect';
import { GameEffect, Player } from './types';

const HANDICAP_EFFECT_FACTORIES: Array<(p: Player) => GameEffect> = [
    player => createShrinkPlayerEffect(player),
    player => createMakeBarelyVisibleEffect(player),
    player => createInvertControlsEffect(player),
    player => createSpinningEffect(player)
];

export function getRandomHandicap(player: Player) {
    const randomIdx = Math.floor(Math.random() * HANDICAP_EFFECT_FACTORIES.length);
    return HANDICAP_EFFECT_FACTORIES[randomIdx](player);
}