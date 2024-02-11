import { b2Body, b2Vec2, b2World } from '@box2d/core';
import { createBall, createDynamicRectBody, createEdge } from './b2d-utils';
import { WORLD_BOUNDARY_LEFT, WORLD_BOUNDARY_BOTTOM, WORLD_BOUNDARY_TOP, WORLD_BOUNDARY_RIGHT, PLAYER_START_POS, playerMass } from './physical-constants';
import { PLAYER_SIZE } from './physical-constants';
import { Vc2 } from './types';

export const initWorld = () => {
    // create box 2d world
    const gravity = new b2Vec2(0, 0);
    const world = b2World.Create(gravity);
    // boundaries
    initWorldBoundaries(world);
    // players
    const { player1Body, player2Body } = initPlayers(world);
    // ball
    initBall(world);
    
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
    const player1Body = createPlayer(world, PLAYER_START_POS);
    const reflectedStartPos = { x: -PLAYER_START_POS.x, y: PLAYER_START_POS.y};
    const player2Body = createPlayer(world, reflectedStartPos);
    return { player1Body, player2Body };
}

function createPlayer(world: b2World, pos: Vc2) {
    return createDynamicRectBody(world, pos, PLAYER_SIZE, { mass: playerMass, fixedRotation: true });
}

function initWorldBoundaries(world: b2World): void {
    // LEFT
    createEdge(world, { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_BOTTOM }, { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_TOP });
    // RIGHT
    createEdge(world, { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_BOTTOM }, { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_TOP });
    // BOTTOM
    createEdge(world, { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_BOTTOM }, { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_BOTTOM });
    // TOP
    createEdge(world, { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_TOP }, { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_TOP });
}

function initBall(world: b2World) {
    return createBall(world, b2Vec2.ZERO, 2);
}