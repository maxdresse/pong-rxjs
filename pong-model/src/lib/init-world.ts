import { b2Body, b2ContactListener, b2Vec2, b2World } from '@box2d/core';
import { createBall, createDynamicRectBody, createEdge } from './b2d-utils';
import { PLAYER_START_POS, playerMass } from './physical-constants';
import { PLAYER_SIZE } from './physical-constants';
import { Player, SomeGameEvent, Vc2 } from './types';
import { W_LOWER_LEFT, W_UPPER_LEFT, W_LOWER_RIGHT, W_UPPER_RIGHT } from './physical-constants';
import { getGoalUserData, getPlayerUserData, getWallUserData } from './body-user-data';
import { createContactListener } from './contact-listener';
import { playerRestitution } from './physical-constants';

export interface InitWorlProps {
    onEvent: (ev: SomeGameEvent) => void;
}

export const initWorld = ({ onEvent }: InitWorlProps) => {
    // create box 2d world
    const gravity = new b2Vec2(0, 0);
    const world = b2World.Create(gravity);
    // boundaries
    initWorldBoundaries(world);
    // players
    const { player1Body, player2Body } = initPlayers(world);
    // ball
    initBall(world);
    // wire contact listener to event callback
    const constactListener: b2ContactListener = createContactListener(onEvent);
    world.SetContactListener(constactListener);
    // setup teardown handle for our caller
    const tearDownWorld = () => {
        let b = world.GetBodyList();
        while (!!b) {
            world.DestroyBody(b);
            b = b.GetNext();
        };
    };
    return { 
        world,
        playerBodies: [player1Body, player2Body] as [b2Body, b2Body],
        tearDownWorld
        };
};

function initPlayers(world: b2World) {
    const player1Body = createPlayer(world, PLAYER_START_POS, Player.PLAYER1);
    const reflectedStartPos = { x: -PLAYER_START_POS.x, y: PLAYER_START_POS.y};
    const player2Body = createPlayer(world, reflectedStartPos, Player.PLAYER2);
    return { player1Body, player2Body };
}

function createPlayer(world: b2World, pos: Vc2, player: Player) {
    return createDynamicRectBody(world, pos, PLAYER_SIZE,
         { 
            fixedRotation: true,
            restitution: playerRestitution,
            userData: getPlayerUserData(player)
         });
}

function initWorldBoundaries(world: b2World): void {
    const optsWall =  { userData: getWallUserData() };
    const optsGoal =  { userData: getGoalUserData() };
    
    // LEFT
    createEdge(world, W_LOWER_LEFT, W_UPPER_LEFT, optsGoal);
    // RIGHT
    createEdge(world, W_LOWER_RIGHT, W_UPPER_RIGHT, optsGoal);
    // BOTTOM
    createEdge(world, W_LOWER_LEFT, W_LOWER_RIGHT, optsWall);
    // TOP
    createEdge(world, W_UPPER_LEFT, W_UPPER_RIGHT, optsWall);
}

function initBall(world: b2World) {
    return createBall(world, b2Vec2.ZERO, 2);
}