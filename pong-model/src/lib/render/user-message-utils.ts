import { Player, UserMessageType } from '../types';

export function getPlayerDisplayName(player: Player): string {
    return `Player ${player + 1}`;
}

export function getMsgType(player: Player): UserMessageType {
    return player === Player.PLAYER1 ? UserMessageType.P1 : UserMessageType.P2;
}