import { b2Body, b2EdgeShape, b2Fixture, b2PolygonShape, b2ShapeType } from '@box2d/core';

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

type DrawFct = () => void;

export function drawInBodyContext(ctx: CanvasRenderingContext2D, body: b2Body, drawFct: DrawFct): void {
    const xf = body.GetTransform();

    ctx.save();
    ctx.translate(xf.p.x, xf.p.y);
    ctx.rotate(xf.q.GetAngle());

    drawFct();

    ctx.restore();
}
export function drawLineShape({ ctx, shape, color }: { ctx: CanvasRenderingContext2D; shape: b2EdgeShape; color: string; }): void {
    const p1 = shape.m_vertex1;
    const p2 = shape.m_vertex2;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color;
    ctx.stroke();
}
