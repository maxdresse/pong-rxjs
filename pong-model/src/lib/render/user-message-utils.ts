import { Player } from '../types';

export function getPlayerDisplayName(player: Player): string {
    return `Player ${player + 1}`;
}