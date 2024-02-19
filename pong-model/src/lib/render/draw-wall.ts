import { b2Body, b2EdgeShape, b2Fixture, b2ShapeType } from '@box2d/core';
import { drawInBodyContext } from './draw-utils';
import { drawLineShape } from './draw-utils';
import { IColorScheme } from '../types';

export function drawWall(ctx: CanvasRenderingContext2D, body: b2Body, cs: IColorScheme): void {
    drawInBodyContext(ctx, body, () => {
        drawEdgeFixtures(body, ctx, cs);
    });
}

function drawEdgeFixtures(body: b2Body, ctx: CanvasRenderingContext2D, cs: IColorScheme) {
    for (let f: b2Fixture | null = body.GetFixtureList(); f; f = f.GetNext()) {
        const shape = f.GetShape();
        const shapeType = shape.GetType();
        if (shapeType === b2ShapeType.e_edge) {
            drawLineShape({ ctx, shape: shape as b2EdgeShape, color: cs.wall });
        }
    }
}

