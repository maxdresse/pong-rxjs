import { GameEffect, UserMessageType } from '../types';

export function createPlayEffect(): GameEffect {
    return {
        apply: ({ params }) => {
            params.paused = false;
            params.userMessage = undefined;
        }
    };
}

export function createPauseEffect(): GameEffect {
    return {
        apply: ({ params }) => {
            params.paused = true;
            params.userMessage = {
                type: UserMessageType.BOTH,
                msg: 'Paused'
            };
        }
    };
}