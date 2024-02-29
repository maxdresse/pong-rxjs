import { GameEffect, Player } from '../types';

export function createForceFeedbackEffect(playerWithFeedback: Player): GameEffect {
    return {
        apply: ({ params: { gamePadConfig } }) => {
            const gamepad = gamePadConfig.playerToGamePad[playerWithFeedback];
            if (!gamepad) {
                return;
            }
            const vib = gamepad?.vibrationActuator;
            if (vib) {
                vib.playEffect('dual-rumble', {
                    startDelay: 0,
                    duration: 200,
                    weakMagnitude: 0.2,
                    strongMagnitude: 0.8,
                  });
            }
        }
    };
}