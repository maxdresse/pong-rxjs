import { Subject, map } from 'rxjs';
import { IGameDef, IObj, GameFactory, GameParameters } from './types'
import { b2World, b2Body } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";
import { attachResizer } from './canvas-resizer';
import { drawAll } from './draw-all';
import { initWorld } from './init-world';
import { getDefaultParameters } from './default-parameters';
import { getAllInputs } from './input/get-all-inputs';
import { getGameLogic } from './logic';

interface ILoopDef {
    draw: DebugDraw;
    world: b2World;
    params: GameParameters;
}

const createLoop = ({ draw, world, params }: ILoopDef) => {
    const onFrame$ = new Subject<void>();
    const { timeStep, paused, positionIterations, velocityIterations} = params;
    const loop = () => {
        onFrame$.next();
        world.Step(timeStep, { 
            positionIterations: positionIterations,
            velocityIterations: velocityIterations 
        });
        drawAll(draw, params, world);
        if (!paused) {
            requestAnimationFrame(loop);
        }
    };
    return { loop, onFrame$ };
}

export const createGame: GameFactory = (def: IGameDef) => {

    const objectsSub$ = new Subject<Array<IObj>>();
    const { world, bodies } = initWorld();
    const draw = new DebugDraw(def.canvas.getContext('2d')!);
    const params: GameParameters = getDefaultParameters();
    // create main loop
    const { loop, onFrame$ } = createLoop({ draw, params, world });

    // controls
    const playerBodies = [bodies[1], bodies[2]] as [b2Body, b2Body]; // todo: 2nd is not correct!
    const inputFactory = getAllInputs(def);
    const gameLogic = getGameLogic(def);
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
