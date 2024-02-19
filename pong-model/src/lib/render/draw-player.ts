import { b2Body, b2Fixture, b2PolygonShape, b2ShapeType } from '@box2d/core';

export function drawPolygonalFixtures(body: b2Body, ctx: CanvasRenderingContext2D, colors: { fill: string; stroke: string }) {
    for (let f: b2Fixture | null = body.GetFixtureList(); f; f = f.GetNext()) {
        const shape = f.GetShape() as b2PolygonShape;
        const shapeType = shape.GetType();
        if (shapeType === b2ShapeType.e_polygon) {
            const vertexCount = shape.m_count;
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
}
