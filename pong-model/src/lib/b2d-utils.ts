import { b2World, b2PolygonShape, b2BodyDef, b2BodyType, b2EdgeShape, b2Vec2 } from '@box2d/core';
import { Vc2 } from './types';
import { defaultDamping } from './physical-constants';
import { defaultDensity } from './physical-constants';

export function createDynamicRectBody(world: b2World, position: Vc2, size: Vc2) {
    const bodyDef: b2BodyDef = { position, type: b2BodyType.b2_dynamicBody, enabled: true, linearDamping: defaultDamping };
    return createBox(world, size, bodyDef);
}

export function createStaticRectBody(world: b2World, position: Vc2, size: Vc2) {
    return createBox(world, size, { position });
}

export function createBox(world: b2World, size: Vc2, bodyDef: b2BodyDef) {
    const body = world.CreateBody(bodyDef);
    const shape = new b2PolygonShape();
    shape.SetAsBox(size.x, size.y, { x: 0, y: 0});
    body.CreateFixture({ shape: shape, density: defaultDensity });
    return body;
}

export function createEdge(world: b2World, a: Vc2, b: Vc2) {
    const body = world.CreateBody();
    const shape = new b2EdgeShape();
    shape.SetTwoSided(a, b);
    body.CreateFixture({ shape: shape });
    return body;
}