import { b2World, b2PolygonShape, b2BodyDef, b2BodyType } from '@box2d/core';
import { Vc2 } from './types';

export function createDynamicBody(world: b2World, position: Vc2, size: Vc2) {
    const bodyDef: b2BodyDef = { position, type: b2BodyType.b2_dynamicBody };
    return createBox(world, position, size, bodyDef);
}

export function createStaticRectBody(world: b2World, position: Vc2, size: Vc2) {
    return createBox(world, position, size, { position });
}

export function createBox(world: b2World, position: Vc2, size: Vc2, bodyDef: b2BodyDef) {
    const body = world.CreateBody(bodyDef);
    const shape = new b2PolygonShape();
    shape.SetAsBox(size.x, size.y);
    body.CreateFixture({ shape: shape });
    return body;
}