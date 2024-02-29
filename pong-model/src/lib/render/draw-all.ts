import { GameParameters, IColorScheme } from '../types';
import { b2World, DrawShapes, DrawJoints, b2Fixture, b2ShapeType, b2CircleShape, b2Vec2, b2BodyDef, b2Body } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";
import { UserDataUnion } from '../body-user-data';
import { drawBall } from './draw-ball';
import { drawPlayer } from './draw-player';
import { drawFence } from './draw-fence';
import { drawWall } from './draw-wall';
import { updateCanvasCssProps } from './canvas-css';
import { drawOverlays } from './draw-overlays';

export function debugDrawAll(draw: DebugDraw, params: GameParameters, world: b2World) {
    draw.Prepare(0, 0, params.zoomFactor, true); // center, zoom, flipy
    DrawShapes(draw, world);
    DrawJoints(draw, world);
    // DrawAABBs(draw, world);
    // DrawPairs(draw, world);
    // DrawCenterOfMasses(draw, world);
    draw.Finish();
}

const objTypeToDrawFct: { [key in UserDataUnion['type']]?: (ctx: CanvasRenderingContext2D, b: b2Body, cs: IColorScheme) => void } = {
    ball: drawBall,
    player: drawPlayer,
    fence: drawFence,
    wall: drawWall,
    goal: drawWall
};

export function drawAll(ctx: CanvasRenderingContext2D, params: GameParameters, world: b2World) {
    updateCanvasCssProps(ctx.canvas, params);
    drawWorldObjects(ctx, params, world);
    drawOverlays(ctx, params);
}

function drawWorldObjects(ctx: CanvasRenderingContext2D, params: GameParameters, world: b2World) {
    const zoom = params.zoomFactor;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
    ctx.scale(1, -1);
    ctx.scale(zoom, zoom);
    ctx.lineWidth /= zoom;
    ctx.translate(0, 0);

    for (let b = world.GetBodyList(); b; b = b.GetNext()) {
        const type = b.GetUserData()?.type as UserDataUnion['type'];
        const drawFct = objTypeToDrawFct[type];
        if (drawFct) {
            drawFct(ctx, b, params.colorScheme);
        }
    }

    ctx.restore();
}

