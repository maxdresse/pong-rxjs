import { GameEffect } from '../types';

export function createPlayEffect(): GameEffect {
    return {
        apply: ({ params, startLoop }) => {
            params.paused = false;
            startLoop();
        }
    };
}

export function createPauseEffect(): GameEffect {
    return {
        apply: ({ params }) => {
            params.paused = true;
        }
    };
}