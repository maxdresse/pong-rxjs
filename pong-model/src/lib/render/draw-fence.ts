import { b2Body } from '@box2d/core';
import { drawInBodyContext, drawPolygonalFixtures } from './draw-utils';
import { IColorScheme } from '../types';

export function drawFence(ctx: CanvasRenderingContext2D, body: b2Body, cs: IColorScheme): void {
    drawInBodyContext(ctx, body, () => {
        drawPolygonalFixtures(body, ctx, { fill: cs.fence.fill, stroke: cs.fence.stroke });
    });
}

