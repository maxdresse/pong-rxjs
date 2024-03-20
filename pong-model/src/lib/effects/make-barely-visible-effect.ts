import { GameEffect, Player } from '../types';
import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { PlayerUserData } from '../body-user-data';

export function createMakeBarelyVisibleEffect(player: Player, duration = DEFAUL_MUTATION_DURATION): GameEffect {
    return {
        apply: ({ playerBodies }) => {
            const body = playerBodies[player];
            if (!body) {
                return;
            }
            const userData = body.GetUserData() as PlayerUserData;
            if (!userData) { 
                return;
            } 
            userData.isBarelyVisible = true;
            setTimeout(() => {
                userData.isBarelyVisible = false;
            }, duration)
        }
    };
}
