import { BehaviorSubject, Subject, map, merge, of } from 'rxjs';
import { IGameDef, IObj, GameFactory, GameParameters, GameEffect, SomeGameEvent, IRenderer } from './types'
import { b2World } from '@box2d/core';
import { attachResizer } from './canvas-resizer';
import { initWorld } from './init-world';
import { getDefaultParameters } from './default-parameters';
import { getAllInputs } from './input/get-all-inputs';
import { createGameLogic } from './logic';
import { DEFAULT_ASPECT_RATIO } from './render/render-constants';
import { createInitialScore } from './score';
import { createRenderer } from './render/renderer';
import { forOneOrMany } from './array-utils';
import { initUI } from './ui/ui';

interface ILoopDef {
    renderer: IRenderer;
    world: b2World;
    params: GameParameters;
}

const createLoop = ({ renderer, world, params }: ILoopDef) => {
    const onFrame$ = new Subject<void>();
    const { timeStep, paused, positionIterations, velocityIterations} = params;
    const loop = () => {
        onFrame$.next();
        world.Step(timeStep, { 
            positionIterations,
            velocityIterations 
        });
        renderer.draw(world);
        if (!paused) {
            requestAnimationFrame(loop);
        }
    };
    return { loop, onFrame$ };
}
export const createGame: GameFactory = (def: IGameDef) => {

    const objectsSub$ = new Subject<Array<IObj>>();
    // events
    const score = createInitialScore();
    const gameLogic = createGameLogic({ score });
    const eventSubj$ = new Subject<SomeGameEvent>();
    const events$ = eventSubj$.pipe(
        map(gameLogic.eventResponder)
    );
    const onEvent = (ev: SomeGameEvent) => eventSubj$.next(ev);
    // create world
    const { world, playerBodies, ballBody, tearDownWorld } = initWorld({ onEvent });
    
    // create main loop
    const ctx = def.canvas.getContext('2d');
    if (!ctx) {
        throw Error('unexpected null context');
    }
    const params: GameParameters = getDefaultParameters();
    const renderer = createRenderer(ctx, params);

    def.canvas.style.backgroundColor = params.colorScheme.background;
    const { loop, onFrame$ } = createLoop({ renderer, params, world });

    // controls
    const gameSituation = { playerBodies, ballBody, params, score };
    const inputFactory = getAllInputs();
    const inputs$ = inputFactory({ onFrame$ }).pipe(
        map(gameLogic.intentResponder)
    );

    // wire events and controls to effects
    const sub = merge(inputs$, events$)
        .subscribe(effect => forOneOrMany(effect, e => e.apply(gameSituation)));

    // canvas size management
    const aspectRatio$ = new BehaviorSubject<number>(DEFAULT_ASPECT_RATIO);
    const { detachResizer, devicePxPerMeter$: devicePxPerMeter } = attachResizer(def.canvas, aspectRatio$);
    sub.add(devicePxPerMeter.subscribe(pxPerMtr => params.zoomFactor = pxPerMtr));

    // ui
    initUI(def.canvas, { input$: of({ score: { playerToScore: [0, 0] }}) });

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
