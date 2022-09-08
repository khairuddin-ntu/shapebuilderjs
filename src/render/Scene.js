import React, { useRef, useEffect } from 'react';
import ShapeRenderer from './ShapeRenderer';

import './Scene.css';

export default function Scene(props) {
    let currentMouseX;
    let currentMouseY;
    let isDragging = false;
    const renderer = useRef();
    const canvasRef = useRef();

    useEffect(() => { renderer.current = new ShapeRenderer(canvasRef.current); }, []);

    useEffect(() => {
        const currentRenderer = renderer.current;
        if (currentRenderer == null) {
            return;
        }

        currentRenderer.renderShape(
            (u, v) => 5 * Math.cos(2 * Math.PI * u),
            (u, v) => 5 * Math.sin(2 * Math.PI * u),
            (u, v) => (11 * v) - 5,
            props.renderParams.parameters,
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

    const changeShapeZoom = (event) => renderer.current.zoomBy(event.deltaY);

    return (
        <canvas
            id="canvas"
            ref={canvasRef}
            onMouseDown={startDrag}
            onMouseMove={onDrag}
            onMouseUp={endDrag}
            onMouseOut={endDrag}
            onWheel={changeShapeZoom}
        />
    );
}
