import { Player } from './types';

export function otherPlayer(player: Player): Player {
    return player === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
} 