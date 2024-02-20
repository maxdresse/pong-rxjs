import { b2Body, b2PolygonShape, b2Shape, b2ShapeType } from '@box2d/core';
import { drawInBodyContext, drawPolygonalFixtures } from './draw-utils';
import { IColorScheme } from '../types';


export function drawPlayer(ctx: CanvasRenderingContext2D, body: b2Body, cs: IColorScheme): void {
    drawInBodyContext(ctx, body, () => {
        const { player: { fill, stroke } } = cs;
        drawPolygonalFixtures(body, ctx, { fill, stroke });
        drawPaddle(body, ctx, { fill, stroke });
    });
}

let lastShape: b2PolygonShape;
export function drawPaddle(body: b2Body, ctx: CanvasRenderingContext2D, colors: { fill: string; stroke: string }) {
    const f = body.GetFixtureList();
    if (!f) {
        return;
    }
    const shape = f.GetShape() as b2PolygonShape;
    if (JSON.stringify(lastShape?.m_vertices) !== JSON.stringify(shape.m_vertices)) {
        console.log(shape?.m_vertices);
        lastShape = shape;
    }
    const shapeType = shape.GetType();
    if (shapeType === b2ShapeType.e_polygon) {
        const vertexCount = shape.m_count;
        if (vertexCount !== 4) {
            console.error('unexpected non-4-vertex shape');
        }
        const vertices = shape.m_vertices;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertexCount; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.stroke();
    }
}