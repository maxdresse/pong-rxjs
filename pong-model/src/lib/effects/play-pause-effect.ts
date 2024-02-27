import { GameEffect } from '../types';

export function createPlayEffect(): GameEffect {
    return {
        apply: ({ params }) => {
            params.paused = false;
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