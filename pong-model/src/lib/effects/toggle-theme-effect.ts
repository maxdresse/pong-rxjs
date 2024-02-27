import { ALL_COLOR_SCHEMES } from '../render/color-schemes/all-color-schemes';
import { GameEffect } from '../types';

export function createToggleThemeEffect(): GameEffect {
    return {
        apply: ({ params }) => {
            const colorScheme = params.colorScheme;
            const idx = ALL_COLOR_SCHEMES.indexOf(colorScheme);
            if (idx < 0) {
                return;
            }
            params.colorScheme = ALL_COLOR_SCHEMES[(idx + 1) % ALL_COLOR_SCHEMES.length];
        }
    };
}