import { b2Body } from '@box2d/core';
import { Player } from './types';

const playerType = 'player';
const wallType = 'wall';

export function getWallUserData(): any {
    return { type: wallType };
}

export function getPlayerUserData(player: Player): any {
    return { type: playerType, player };
}

export function isWall(body: b2Body): boolean {
    return body.GetUserData()?.type == wallType;
}

export function isPlayer(body: b2Body): boolean {
    return body.GetUserData()?.type == playerType;
}

export function getPlayer(body: b2Body): Player | undefined {
    return body.GetUserData()?.player;
}