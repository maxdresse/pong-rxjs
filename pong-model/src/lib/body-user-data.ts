import { b2Body } from '@box2d/core';
import { ObjectType, Player } from './types';

const playerType: ObjectType = 'player';
const wallType: ObjectType = 'wall';
const goalType: ObjectType = 'goal';
const ballType: ObjectType = 'ball';

export function getWallUserData() {
    return { type: wallType };
}

export function isWall(body: b2Body): boolean {
    return body.GetUserData()?.type == wallType;
}

export function getGoalUserData(owningPlayer: Player) {
    return { type: goalType, owningPlayer };
}

export function isGoal(body: b2Body): boolean {
    return body.GetUserData()?.type == goalType;
}

export function getOwningPlayer(goalBody: b2Body): Player {
    return goalBody.GetUserData().owningPlayer;
}

export function getPlayerUserData(player: Player) {
    return { type: playerType, player };
}

export function isPlayer(body: b2Body): boolean {
    return body.GetUserData()?.type == playerType;
}

export function getPlayer(body: b2Body): Player | undefined {
    return body.GetUserData()?.player;
}

export function isBall(body: b2Body): boolean {
    return body.GetUserData()?.type == ballType;
}

export function getBallUserData() {
    return { type: ballType };
}