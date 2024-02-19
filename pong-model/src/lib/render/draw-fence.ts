import { b2Body } from '@box2d/core';
import { drawInBodyContext, drawPolygonalFixtures } from './draw-utils';

export function drawFence(ctx: CanvasRenderingContext2D, body: b2Body): void {
    drawInBodyContext(ctx, body, () => {
        drawPolygonalFixtures(body, ctx, { fill: 'rgba(185, 222, 186, 0.2', stroke: 'lightgreen' });
    });
}

