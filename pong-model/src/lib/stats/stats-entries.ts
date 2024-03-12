import { GameSituation, Player, ValueType } from '../types';

export const STATS_ENTRIES: Array<{ attrId: string; label: string; getValue: (gs: GameSituation) => ValueType; }> = [
    getScore(Player.PLAYER1),
    getScore(Player.PLAYER2),
    getVelocity(Player.PLAYER1, 'x'),
    getVelocity(Player.PLAYER1, 'y'),
    getVelocity(Player.PLAYER2, 'x'),
    getVelocity(Player.PLAYER2, 'y'),
    getPosition(Player.PLAYER1, 'x'),
    getPosition(Player.PLAYER1, 'y'),
    getPosition(Player.PLAYER2, 'x'),
    getPosition(Player.PLAYER2, 'y'),
];

function getScore(player: Player): { attrId: string; label: string; getValue: (gs: GameSituation) => ValueType; } {
    return {
        attrId: 'scorep' + plStr(player),
        label: 'Score P' + plStr(player),
        getValue: ({ score }) => score.playerToScore[player]
    };
}

function getVelocity(player: Player, xOrY: 'x' | 'y'): { attrId: string; label: string; getValue: (gs: GameSituation) => ValueType; } {
    return {
        attrId: getPlayerAttributeId(player, xOrY, 'v'),
        label: getPlayerLabel(player, xOrY, 'Velocity'),
        getValue: (gameSituation: GameSituation) => gameSituation
            .playerBodies[player]
            .GetLinearVelocity()[xOrY]
    };
}

function getPosition(player: Player, xOrY: 'x' | 'y'): { attrId: string; label: string; getValue: (gs: GameSituation) => ValueType; } {
    return {
        attrId: getPlayerAttributeId(player, xOrY, 'p'),
        label: getPlayerLabel(player, xOrY, 'Position'),
        getValue: (gameSituation: GameSituation) => gameSituation
            .playerBodies[player]
            .GetPosition()[xOrY]
    };
}

function getPlayerLabel(player: Player, xOrY: string, infix: string): string {
    return 'P' + plStr(player) + infix + ' ' + xOrY;
}

function getPlayerAttributeId(player: Player, xOrY: string, infix: string): string {
    return 'p' + infix + plStr(player) + xOrY;
}

function plStr(player: Player): string {
    return '' + (player + 1);
}