import { BehaviorSubject, Subject, Subscription, map, merge, of } from 'rxjs';
import { IGameDef, IObj, GameFactory, GameParameters, GameEffect, SomeGameEvent, IRenderer, SomeGameIntent } from './types'
import { b2World } from '@box2d/core';
import { attachResizer } from './canvas-resizer';
import { initWorld } from './init-world';
import { getDefaultParameters } from './default-parameters';
import { getAllGameInputs } from './input/get-all-inputs';
import { createGameLogic } from './logic';
import { DEFAULT_ASPECT_RATIO } from './render/render-constants';
import { createInitialScore } from './score';
import { createRenderer } from './render/renderer';
import { forOneOrMany } from './array-utils';
import { initUI } from './ui/ui';
import { getGamepadConfig } from './gamepad-config';
import { incrementFrameCount, initFrameCount } from './frame-counter';
import { getGameStats } from './stats/stats-logger';

interface ILoopDef {
    renderer: IRenderer;
    world: b2World;
    params: GameParameters;
}

const createLoop = ({ renderer, world, params }: ILoopDef) => {
    initFrameCount();
    const onFrame$ = new Subject<void>();
    const { timeStep, positionIterations, velocityIterations} = params;
    const loop = () => {
        incrementFrameCount();
        onFrame$.next();
        if (!params.paused) {
            world.Step(timeStep, { 
                positionIterations,
                velocityIterations 
            });
        }
        renderer.draw(world);
        requestAnimationFrame(loop);
        
    };
    return { loop, onFrame$ };
}
export const createGame: GameFactory = (def: IGameDef) => {

    // events
    const [score, playerToScore$] = createInitialScore();
    const params: GameParameters = getDefaultParameters();
    const gameLogic = createGameLogic({ score, params });
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
    const renderer = createRenderer(ctx, params);
    const { loop, onFrame$ } = createLoop({ renderer, params, world });

    const sub = new Subscription();
    // gamepad watcher
    const gamePadConfig$ = getGamepadConfig();
    sub.add(
        gamePadConfig$.subscribe(gpcf => params.gamePadConfig = gpcf)
    );

    // ui
    const uiControlIntents$ = new Subject<SomeGameIntent>();
    initUI(def.canvas, { 
        score$: playerToScore$,
        params,
        onUiIntent: i => uiControlIntents$.next(i),
        gamePadConfig$
     });

    // controls
    const gameInputFactory = getAllGameInputs();
    const gameControlIntents$ = gameInputFactory({ onFrame$ });
    const inputs$ = merge(gameControlIntents$, uiControlIntents$).pipe(
        map(gameLogic.intentResponder)
    );

    // wire events and controls to effects
    const gameSituation = { playerBodies, ballBody, params, score, startLoop: () => requestAnimationFrame(loop) };
    sub.add(
        merge(inputs$, events$)
           .subscribe(effect => forOneOrMany(effect, e => e.apply(gameSituation)))
    );
    // canvas size management
    const aspectRatio$ = new BehaviorSubject<number>(DEFAULT_ASPECT_RATIO);
    const { detachResizer, devicePxPerMeter$: devicePxPerMeter } = attachResizer(def.canvas, aspectRatio$);
    sub.add(devicePxPerMeter.subscribe(pxPerMtr => params.zoomFactor = pxPerMtr));

    // game stats:
    const statsConfig = def?.stats;
    const stats$ = getGameStats({ onFrame$, statsConfig, getGameSituation: () => gameSituation });

    // tip off game loop
    gameSituation.startLoop();

    return {
        stats$,
        tearDown: () => {
            sub.unsubscribe();
            tearDownWorld();
            detachResizer();
        }
    };
};
