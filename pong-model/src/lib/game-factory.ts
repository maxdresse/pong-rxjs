import { Subject, map } from 'rxjs';
import { IGameDef, IObj, GameFactory, Player } from './types'
import { b2Vec2, b2World, DrawShapes, DrawJoints, DrawAABBs, DrawCenterOfMasses, DrawPairs, b2Draw, b2Body } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";
import { attachResizer } from './canvas-resizer';
import { createDynamicRectBody, createEdge, createStaticRectBody } from './b2d-utils';
import { getKeyboardInput } from './input/keyboard-input';
import { defaultGameLogic } from './logic';

interface ILoopDef {
    draw: DebugDraw;
    world: b2World;
    gameDef: IGameDef;
    paused: boolean;
}

const defaultZoom = 3;

const createLoop = ({ draw, world, paused, gameDef }: ILoopDef) => {
    const onFrame$ = new Subject<void>();
    const l = () => {
        onFrame$.next();
        // for each iteration
        // update simulation
        world.Step(1000 / 16, { positionIterations: 3, velocityIterations: 8 });
        // call debug draw
        draw.Prepare(0, 0, gameDef.zoomFactor ?? defaultZoom, true); // center, zoom, flipy
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
    return { loop: l, onFrame$ };
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

export const createGame: GameFactory = (def: IGameDef) => {

    const objectsSub$ = new Subject<Array<IObj>>();
    const { world, bodies } = setupWorld();
    const draw = new DebugDraw(def.canvas.getContext('2d')!);
    // create main loop
    const { loop, onFrame$ } = createLoop({ draw, gameDef: def, world, paused: false});

    // controls
    const playerBodies = [bodies[1], bodies[2]] as [b2Body, b2Body]; // todo: 2nd is not correct!
    const inputFactory = def.inputFactory ?? getKeyboardInput(Player.PLAYER1);
    const gameLogic = def.gameLogic ?? defaultGameLogic;
    const sub = inputFactory({ onFrame$ }).pipe(
        map(intent => gameLogic.intentResponder(intent))
    ).subscribe(effect => effect.apply({ playerBodies }))

    const aspectRatio = 1;
    const { detachResizer } = attachResizer(def.canvas, aspectRatio);
    // todo: wire loop execution to match control
    requestAnimationFrame(loop);

    return {
        objects$: objectsSub$,
        tearDown: () => {
            sub.unsubscribe();
            bodies.forEach(b => {
                world.DestroyBody(b);
            });
            detachResizer();
        }
    };
};


