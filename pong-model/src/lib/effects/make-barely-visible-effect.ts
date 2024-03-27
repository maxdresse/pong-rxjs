import { GameEffect, Player } from '../types';
import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { PlayerUserData } from '../body-user-data';
import { showFlashingMsgToPlayer } from '../render/user-message-utils';
import { scheduleRevertFct } from '../schedule-revert-fct';

export function createMakeBarelyVisibleEffect(player: Player, duration = DEFAUL_MUTATION_DURATION): GameEffect {
    return {
        apply: ({ playerBodies, params }) => {
            const body = playerBodies[player];
            if (!body) {
                return;
            }
            const userData = body.GetUserData() as PlayerUserData;
            if (!userData) { 
                return;
            } 
            userData.isBarelyVisible = true;
            showFlashingMsgToPlayer('Invisible!', player, params);
            scheduleRevertFct(() => {
                userData.isBarelyVisible = false;
            }, duration, params.revertPlayerEffectFcts);
        }
    };
}
