import { b2Body, b2BodyDef, b2ContactListener, b2Vec2, b2World } from '@box2d/core';
import { createBall, createBox, createDynamicRectBody, createEdge } from './b2d-utils';
import { BALL_INITIAL_POS, FENCE_SIZE, FIRST_PLAYER_START_POS, PLAYER_MASS, PLAYER_FRICTION, PLAYER_DAMPING } from './physical-constants';
import { PLAYER_SIZE } from './physical-constants';
import { Player, SomeGameEvent, Vc2 } from './types';
import { W_LOWER_LEFT, W_UPPER_LEFT, W_LOWER_RIGHT, W_UPPER_RIGHT } from './physical-constants';
import { getBallUserData, getFenceUserData, getGoalUserData, getPlayerUserData, getWallUserData } from './body-user-data';
import { createContactListener } from './contact-listener';
import { PLAYER_RESTITUTION } from './physical-constants';
import { createContactFilter } from './contact-filter';

export interface InitWorldProps {
    onEvent: (ev: SomeGameEvent) => void;
}

export const initWorld = ({ onEvent }: InitWorldProps) => {
    // create box 2d world
    const gravity = new b2Vec2(0, 0);
    const world = b2World.Create(gravity);
    // boundaries
    initWorldBoundaries(world);
    // fence
    initFence(world);
    // players
    const { player1Body, player2Body } = initPlayers(world);
    // ball
    const ballBody = initBall(world);
    // wire contact listener to event callback
    const constactListener: b2ContactListener = createContactListener(onEvent);
    world.SetContactListener(constactListener);
    world.SetContactFilter(createContactFilter())
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
        ballBody,
        tearDownWorld
        };
};

function initPlayers(world: b2World) {
    const player1Body = createPlayer(world, FIRST_PLAYER_START_POS, Player.PLAYER1);
    const reflectedStartPos = { x: -FIRST_PLAYER_START_POS.x, y: FIRST_PLAYER_START_POS.y};
    const player2Body = createPlayer(world, reflectedStartPos, Player.PLAYER2);
    return { player1Body, player2Body };
}

function createPlayer(world: b2World, pos: Vc2, player: Player) {
    return createDynamicRectBody(world, pos, PLAYER_SIZE,
         { 
            fixedRotation: true,
            restitution: PLAYER_RESTITUTION,
            friction: PLAYER_FRICTION,
            damping: PLAYER_DAMPING,
            userData: getPlayerUserData(player)
         });
}

function initWorldBoundaries(world: b2World): void {
    const optsWall =  { userData: getWallUserData() };
    const optsGoal = (player: Player) =>  ({ userData: getGoalUserData(player) });
    
    // LEFT
    createEdge(world, W_LOWER_LEFT, W_UPPER_LEFT, optsGoal(Player.PLAYER1));
    // RIGHT
    createEdge(world, W_LOWER_RIGHT, W_UPPER_RIGHT, optsGoal(Player.PLAYER2));
    // BOTTOM
    createEdge(world, W_LOWER_LEFT, W_LOWER_RIGHT, optsWall);
    // TOP
    createEdge(world, W_UPPER_LEFT, W_UPPER_RIGHT, optsWall);
}

function initBall(world: b2World) {
    return createBall(world, BALL_INITIAL_POS, 2, getBallUserData());
}

function initFence(world: b2World) {
    const bodyDef: b2BodyDef = { position: { x: 0, y: 0 }, userData: getFenceUserData() };
    return createBox(world, FENCE_SIZE, bodyDef);
}