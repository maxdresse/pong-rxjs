import { b2Body } from '@box2d/core';
import { drawInBodyContext, drawPolygonalFixtures } from './draw-utils';


export function drawPlayer(ctx: CanvasRenderingContext2D, body: b2Body): void {
    drawInBodyContext(ctx, body, () => {
        drawPolygonalFixtures(body, ctx, { fill: 'orange', stroke: 'darkorange' });
    });
}

