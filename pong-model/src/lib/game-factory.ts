import { BehaviorSubject, Subject, map, merge } from 'rxjs';
import { IGameDef, IObj, GameFactory, GameParameters, GameEffect, SomeGameEvent } from './types'
import { b2World } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";
import { attachResizer } from './canvas-resizer';
import { drawAll } from './draw-all';
import { initWorld } from './init-world';
import { getDefaultParameters } from './default-parameters';
import { getAllInputs } from './input/get-all-inputs';
import { getGameLogic } from './logic';
import { defaultAspectRatio } from './render-constants';
import { createInitialScore } from './score';

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
    // events
    const gameLogic = getGameLogic(def);
    const eventSubj$ = new Subject<SomeGameEvent>();
    const events$ = eventSubj$.pipe(
        map(gameLogic.eventResponder)
    );
    const onEvent = (ev: SomeGameEvent) => eventSubj$.next(ev);
    // create world
    const { world, playerBodies, tearDownWorld } = initWorld({ onEvent });
    
    // create main loop
    const draw = new DebugDraw(def.canvas.getContext('2d')!);
    const params: GameParameters = getDefaultParameters();
    const { loop, onFrame$ } = createLoop({ draw, params, world });

    const score = createInitialScore();
    // controls
    const gameSituation = { playerBodies, params, score };
    const inputFactory = getAllInputs(def);
    const inputs$ = inputFactory({ onFrame$ }).pipe(
        map(gameLogic.intentResponder)
    );

    // wire events and controls to effects
    const sub = merge(inputs$, events$)
        .subscribe(effect => effect.apply(gameSituation))

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
