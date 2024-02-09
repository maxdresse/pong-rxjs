import { GameEffect, GameSituation, Player, Vc2 } from '../types';

export const MovePlayerEffect: GameEffect<{player: Player; direction: Vc2}> = {
    apply: ({ playerBodies }: GameSituation, { player, direction }) => {
        const body = playerBodies[player];

        if (body) {
            //body.
        }
    }
};