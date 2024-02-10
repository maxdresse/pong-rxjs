import { b2Vec2, b2World } from '@box2d/core';
import { createDynamicRectBody, createEdge, createStaticRectBody } from './b2d-utils';


export const initWorld = () => {
    // create box 2d world
    const gravity = new b2Vec2(0, 0);
    const world = b2World.Create(gravity);
    const groundBody = createStaticRectBody(world, { x: 0, y: -10 }, { x: 50, y: 10 });
    const dynamicBody = createDynamicRectBody(world, { x: 0, y: 50 }, { x: 50, y: 10 });
    const leftEdge = createEdge(world, { x: -100, y: -100 }, { x: -100, y: 300 });
    const bodies = [groundBody, dynamicBody, leftEdge];
    return { world, bodies };
};
