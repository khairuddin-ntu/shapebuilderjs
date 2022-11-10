import React, { useRef, useEffect } from 'react';
import ShapeRenderer from './ShapeRenderer';

import './Scene.css';

export default function Scene(props) {
    const isShapeLoading = props.isShapeLoading;

    let currentMouseX;
    let currentMouseY;
    let isDragging = false;

    const renderer = useRef();
    const canvasRef = useRef();

    useEffect(() => { renderer.current = new ShapeRenderer(canvasRef.current); }, []);

    useEffect(() => {
        const currentRenderer = renderer.current;
        if (!currentRenderer || !props.renderData) {
            return;
        }

        currentRenderer.renderShape(props.renderData);
    }, [props.renderData]);

    const startDrag = (event) => {
        if (isShapeLoading) {
            return;
        }

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
            ref={canvasRef}
            onPointerDown={startDrag}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerOut={endDrag}
            onWheel={changeShapeZoom}
        />
    );
}
