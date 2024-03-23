import { GameEffect, Player } from '../types';
import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { showFlashingMsgToPlayer } from '../render/user-message-utils';

export function createSpinningEffect(player: Player, duration = DEFAUL_MUTATION_DURATION): GameEffect {
    return {
        apply: ({ playerBodies, params }) => {
            const body = playerBodies[player];
            if (!body) {
                return;
            }
            body.SetFixedRotation(false);
            body.SetAngularDamping(0);
            let cancelled = false;
            const applyTorq = () => {
                body.ApplyTorque(0.01);
                if (cancelled) {
                    return;
                }
                requestAnimationFrame(applyTorq);
            }
            requestAnimationFrame(applyTorq);
            showFlashingMsgToPlayer('Spinning!', player, params);
            setTimeout(() => {
                cancelled = true;
                body.SetFixedRotation(true);
                body.SetAngle(0);
            }, duration)
        }
    };
}
