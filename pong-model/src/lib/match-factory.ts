import { Subject } from 'rxjs';
import { IMatchDef, IObj, MatchFactory } from './types'
import { b2Vec2, b2World, b2PolygonShape, DrawShapes, DrawJoints, DrawAABBs, DrawCenterOfMasses, DrawPairs } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";

export const createMatch: MatchFactory = (def: IMatchDef) => {
    const objectsSub$ = new Subject<Array<IObj>>();

    // create box 2d world
    const gravity = new b2Vec2(0.0, -10.0);
    const world = b2World.Create(gravity);
    // add bodies and tracking IObj for them
    const groundBody = world.CreateBody({ position: { x: 0, y: -10 }});
    const groundBox = new b2PolygonShape();
    groundBox.SetAsBox(50.0, 10.0);
    groundBody.CreateFixture({ shape: groundBox });
    const draw = new DebugDraw(def.canvas.getContext('2d')!);
    // create main loop
    let paused = false;
    const loop = () => {
        // for each iteration
        // update simulation
        world.Step(1000 / 16, { positionIterations: 3, velocityIterations: 8 });
        // call debug draw
        draw.Prepare(0, 0, 1, true); // center, zoom, flipy
        DrawShapes(draw, world);
        DrawJoints(draw, world);
        DrawAABBs(draw, world);
        DrawPairs(draw, world);
        DrawCenterOfMasses(draw, world);
        draw.Finish();
        // next object subject, decoupled
        // if not paused, trigger next frame
        if (!paused) {
            requestAnimationFrame(loop);
        }
    };

    // wire loop execution to match control
    requestAnimationFrame(loop);


    return {
        objects$: objectsSub$,
        tearDown: () => {
            //
        }
    };
};