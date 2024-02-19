import { DebugDraw } from '@box2d/debug-draw';
import { GameParameters, IRenderer } from '../types';
import { debugDrawAll, drawAll } from './draw-all';
import { USE_DEBUG_RENDERER } from './render-constants';

const createDebugRenderer: typeof createRenderer = (ctx, params) =>  {
    const debugDraw = new DebugDraw(ctx);
    return {
        draw: world => debugDrawAll(debugDraw, params, world)
    }
};

const createDefaultRenderer: typeof createRenderer = (ctx, params) => {
    return {
        draw: world => drawAll(ctx, params, world)
    };
};

export function createRenderer(ctx: CanvasRenderingContext2D, params: GameParameters): IRenderer {
    return USE_DEBUG_RENDERER ? createDebugRenderer(ctx, params) : createDefaultRenderer(ctx, params);
}
