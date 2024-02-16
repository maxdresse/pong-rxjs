import { GameParameters } from './types';
import { b2World, DrawShapes, DrawJoints } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";

export function drawAll(draw: DebugDraw, params: GameParameters, world: b2World) {
    draw.Prepare(0, 0, params.zoomFactor, true); // center, zoom, flipy
    DrawShapes(draw, world);
    DrawJoints(draw, world);
    // DrawAABBs(draw, world);
    // DrawPairs(draw, world);
    // DrawCenterOfMasses(draw, world);
    draw.Finish();
}
