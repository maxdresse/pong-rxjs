import { b2Body, b2Vec2, b2World } from '@box2d/core';
import { createDynamicRectBody, createEdge } from './b2d-utils';


const WORLD_BOUNDARY_LEFT = 500;
const WORLD_BOUNDARY_RIGHT = 500;
const WORLD_BOUNDARY_BOTTOM = -500;
const WORLD_BOUNDARY_TOP = 500;
export const initWorld = () => {
    // create box 2d world
    const gravity = new b2Vec2(0, 0);
    const world = b2World.Create(gravity);
    const player1Body = createDynamicRectBody(world, { x: 0, y: 0 }, { x: 50, y: 10 });
    const player2Body = createDynamicRectBody(world, { x: 0, y: -50 }, { x: 50, y: 10 });
    // LEFT
    createEdge(world, { x: 0, y: 0 }, { x: 0, y: 10 });
    // RIGHT
    /* createEdge(world, { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_BOTTOM }, { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_TOP });
    // BOTTOM
    createEdge(world, { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_BOTTOM }, { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_BOTTOM });
    // TOP
    createEdge(world, { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_TOP }, { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_TOP }); */
    
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
