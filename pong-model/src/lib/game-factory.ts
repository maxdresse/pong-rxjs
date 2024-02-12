import { BehaviorSubject, Subject, map } from 'rxjs';
import { IGameDef, IObj, GameFactory, GameParameters } from './types'
import { b2World } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";
import { attachResizer } from './canvas-resizer';
import { drawAll } from './draw-all';
import { initWorld } from './init-world';
import { getDefaultParameters } from './default-parameters';
import { getAllInputs } from './input/get-all-inputs';
import { getGameLogic } from './logic';
import { defaultAspectRatio } from './render-constants';

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
            positionIterations,
            velocityIterations 
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
    // create world
    const gameLogic = getGameLogic(def);
    const { world, playerBodies, tearDownWorld } = initWorld(gameLogic);
    
    // create main loop
    const draw = new DebugDraw(def.canvas.getContext('2d')!);
    const params: GameParameters = getDefaultParameters();
    const { loop, onFrame$ } = createLoop({ draw, params, world });

    // controls
    const gameSituation = { playerBodies, params };
    const inputFactory = getAllInputs(def);
    const sub = inputFactory({ onFrame$ }).pipe(
        map(intent => gameLogic.intentResponder(intent))
    ).subscribe(effect => effect.apply(gameSituation))

    // canvas size management
    const aspectRatio$ = new BehaviorSubject<number>(defaultAspectRatio);
    const { detachResizer } = attachResizer(def.canvas, aspectRatio$);

    // tip off game loop
    requestAnimationFrame(loop);

    return {
        objects$: objectsSub$,
        tearDown: () => {
            sub.unsubscribe();
            tearDownWorld();
            detachResizer();
        }
    };
};
