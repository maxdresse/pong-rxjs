import { b2Body, b2Vec2, b2World } from '@box2d/core';
import { createDynamicRectBody, createEdge } from './b2d-utils';
import { WORLD_BOUNDARY_LEFT, WORLD_BOUNDARY_BOTTOM, WORLD_BOUNDARY_TOP, WORLD_BOUNDARY_RIGHT, PLAYER_START_POS } from './physical-constants';
import { PLAYER_SIZE } from './physical-constants';

export const initWorld = () => {
    // create box 2d world
    const gravity = new b2Vec2(0, 0);
    const world = b2World.Create(gravity);
    const { player1Body, player2Body } = initPlayers(world);
    initWorldBoundaries(world);
    
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
    const player1Body = createDynamicRectBody(world, PLAYER_START_POS, PLAYER_SIZE);
    const reflectedStartPos = { x: -PLAYER_START_POS.x, y: PLAYER_START_POS.y};
    const player2Body = createDynamicRectBody(world, reflectedStartPos , PLAYER_SIZE);
    return { player1Body, player2Body };
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

