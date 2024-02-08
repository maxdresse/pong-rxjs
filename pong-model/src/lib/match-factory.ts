import { Subject } from 'rxjs';
import { IMatchDef, IObj, MatchFactory } from './types'
import { b2Vec2, b2World, DrawShapes, DrawJoints, DrawAABBs, DrawCenterOfMasses, DrawPairs, b2Draw } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";
import { attachResizer } from './canvas-resizer';
import { createDynamicRectBody, createEdge, createStaticRectBody } from './b2d-utils';

interface ILoopDef {
    draw: DebugDraw;
    world: b2World;
    matchDef: IMatchDef;
    paused: boolean;
}

const defaultZoom = 3;

const createLoop = ({ draw, world, paused, matchDef }: ILoopDef) => {
    const l = () => {
        // for each iteration
        // update simulation
        world.Step(1000 / 16, { positionIterations: 3, velocityIterations: 8 });
        // call debug draw
        draw.Prepare(0, 0, matchDef.zoomFactor ?? defaultZoom, true); // center, zoom, flipy
        DrawShapes(draw, world);
        DrawJoints(draw, world);
        DrawAABBs(draw, world);
        DrawPairs(draw, world);
        DrawCenterOfMasses(draw, world);
        draw.Finish();
        // todo: next object subject, decoupled
        // if not paused, trigger next frame
        if (!paused) {
            requestAnimationFrame(l);
        }
    };
    return l;
}

export const setupWorld = () => {
    // create box 2d world
    const gravity = new b2Vec2(0.0, 0.0);
    const world = b2World.Create(gravity);
    const groundBody = createStaticRectBody(world, { x: 0, y: -10 }, { x: 50, y: 10 });
    const dynamicBody = createDynamicRectBody(world, { x: 0, y: 50 }, { x: 50, y: 10 });
    const leftEdge = createEdge(world, { x: -100, y: -100 }, { x: -100, y: 300 });
    const bodies = [groundBody, dynamicBody, leftEdge];
    return { world, bodies };
};

export const createMatch: MatchFactory = (def: IMatchDef) => {
    


    const objectsSub$ = new Subject<Array<IObj>>();
    const { world, bodies } = setupWorld();

    // TESTCODE,remove
    window.addEventListener('keydown', ev => {
        if (ev.key === 'ArrowUp') {
            bodies[1].ApplyLinearImpulseToCenter({ x: 0, y: 120_0000 });
        } else if (ev.key === 'ArrowDown') {
            bodies[1].ApplyLinearImpulseToCenter({ x: 0, y: -120_0000 });
        }
    });

    const draw = new DebugDraw(def.canvas.getContext('2d')!);
    // create main loop
    const loop = createLoop({ draw, matchDef: def, world, paused: false});
    const aspectRatio = 1;
    const { detachResizer } = attachResizer(def.canvas, aspectRatio);
    // todo: wire loop execution to match control
    requestAnimationFrame(loop);

    return {
        objects$: objectsSub$,
        tearDown: () => {
            bodies.forEach(b => {
                world.DestroyBody(b);
            });
            detachResizer();
        }
    };
};


