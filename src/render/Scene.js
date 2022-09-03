import React, { useRef, useEffect } from 'react';
import ShapeRenderer from './ShapeRenderer';

import './Scene.css';

export default function Scene(props) {
    let currentMouseX;
    let currentMouseY;
    let isDragging = false;
    const renderer = useRef();
    const canvasRef = useRef();

    useEffect(() => renderer.current = new ShapeRenderer(canvasRef.current), []);

    useEffect(() => {
        const currentRenderer = renderer.current;
        if (currentRenderer == null) {
            return;
        }

        currentRenderer.renderShape(
            (u, v) => 5 * Math.cos(2 * Math.PI * u),
            (u, v) => 5 * Math.sin(2 * Math.PI * u),
            (u, v) => (11 * v) - 5,
            [
                {
                    start: 0, end: 1, get range() { return this.end - this.start }
                },
                {
                    start: 0, end: 1, get range() { return this.end - this.start }
                }
            ],
            props.renderParams.resolution
        );
    }, [props.renderParams]);

    const startDrag = (event) => {
        currentMouseX = event.clientX;
        currentMouseY = event.clientY;

        isDragging = true;
    };

    const onDrag = (event) => {
        if (!isDragging) {
            return;
        }

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const rotationX = mouseX - currentMouseX;
        const rotationY = mouseY - currentMouseY;
        renderer.current.rotateShape(rotationX, rotationY);

        currentMouseX = mouseX;
        currentMouseY = mouseY;
    };

    const endDrag = () => isDragging = false;

    return (
        <canvas
            id="canvas"
            ref={canvasRef}
            onMouseDown={startDrag}
            onMouseMove={onDrag}
            onMouseUp={endDrag}
            onMouseOut={endDrag}
        />
    );
}
