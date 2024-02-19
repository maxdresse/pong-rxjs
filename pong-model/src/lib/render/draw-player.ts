import { b2Body } from '@box2d/core';
import { drawInBodyContext, drawPolygonalFixtures } from './draw-utils';
import { IColorScheme } from '../types';


export function drawPlayer(ctx: CanvasRenderingContext2D, body: b2Body, cs: IColorScheme): void {
    drawInBodyContext(ctx, body, () => {
        const { player: { fill, stroke } } = cs;
        drawPolygonalFixtures(body, ctx, { fill, stroke });
    });
}

