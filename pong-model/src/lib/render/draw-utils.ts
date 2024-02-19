import { drawPolygonalFixtures } from './draw-player';

import { b2Body } from '@box2d/core';


export function drawPlayer(ctx: CanvasRenderingContext2D, body: b2Body): void {
    const xf = body.GetTransform();

    ctx.save();
    ctx.translate(xf.p.x, xf.p.y);
    ctx.rotate(xf.q.GetAngle());

    drawPolygonalFixtures(body, ctx, { fill: 'orange', stroke: 'darkorange' });

    ctx.restore();
}
