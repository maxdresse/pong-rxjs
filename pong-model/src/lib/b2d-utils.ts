import { b2World, b2PolygonShape, b2BodyDef, b2BodyType, b2EdgeShape, b2CircleShape, b2FixtureDef, b2MassData, b2Fixture } from '@box2d/core';
import { Vc2 } from './types';
import { DEFAULT_DAMPING } from './physical-constants';
import { DEFAULT_DENSITY } from './physical-constants';
import { DEFAULT_RESTITUTION_THRESHOLD, DEFAULT_RESTITUTION } from './physical-constants';
import { BALL_DENSITY } from './physical-constants';

export type FixtureDefChanger = (fd: b2FixtureDef) => b2FixtureDef;

export function createDynamicRectBody(
    world: b2World,
    position: Vc2,
    size: Vc2,
    opts: { fixedRotation?: boolean, userData?: any,
            restitution?: number, friction?: number, damping?: number }) {
    const { fixedRotation, userData, restitution, friction, damping } = opts ?? {};
    const bodyDef: b2BodyDef = { 
        position, 
        type: b2BodyType.b2_dynamicBody,
        enabled: true,
        linearDamping: damping ?? DEFAULT_DAMPING,
        fixedRotation,
        userData,
    };
    const body = createBox(world, size, bodyDef, fd => {
        if (typeof restitution === 'number') {
            fd.restitution = restitution;
        }
        if (typeof friction === 'number') {
            fd.friction = friction;
        }
        return fd;
    });
    return body;
}

export function createStaticRectBody(world: b2World, position: Vc2, size: Vc2) {
    return createBox(world, size, { position });
}

export function createBox(world: b2World, size: Vc2, bodyDef: b2BodyDef, fdc?: FixtureDefChanger) {
    const body = world.CreateBody(bodyDef);
    const shape = new b2PolygonShape();
    shape.SetAsBox(size.x / 2, size.y / 2, { x: 0, y: 0});
    let fd = applyDefaultRestitutionAndDensity({ shape: shape });
    if (fdc) {
        fd = fdc(fd);
    }
    body.CreateFixture(fd);
    return body;
}

export function createEdge(world: b2World, a: Vc2, b: Vc2, opts?: { userData?: any}) {
    const { userData } = opts ?? {};
    const body = world.CreateBody({ userData });
    const shape = new b2EdgeShape();
    shape.SetTwoSided(a, b);
    body.CreateFixture(applyDefaultRestitutionAndDensity({ shape: shape }));
    return body;
}

export function createBall(world: b2World, position: Vc2, radius: number, userData: any) {
    const bodyDef = { position, type: b2BodyType.b2_dynamicBody, enabled: true, userData };
    const body = world.CreateBody(bodyDef);
    body.SetBullet(true);
    const shape = new b2CircleShape(radius);
    const fd = applyDefaultRestitutionAndDensity({ shape })
    fd.density = BALL_DENSITY;
    body.CreateFixture(fd);
    return body;
}

function applyDefaultRestitutionAndDensity(fixtureDef: b2FixtureDef): b2FixtureDef {
    fixtureDef.density = DEFAULT_DENSITY;
    fixtureDef.restitutionThreshold = DEFAULT_RESTITUTION_THRESHOLD;
    fixtureDef.restitution= DEFAULT_RESTITUTION;
    return fixtureDef;
}