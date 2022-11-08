import React, { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
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
        <Box id="scene">
            <canvas
                ref={canvasRef}
                onPointerDown={startDrag}
                onPointerMove={onDrag}
                onPointerUp={endDrag}
                onPointerOut={endDrag}
                onWheel={changeShapeZoom}
            />
            {
                isShapeLoading &&
                <Box id="loading__bg">
                    <CircularProgress
                        id="loading__progress"
                        size="10rem"
                    />
                </Box>
            }
        </Box>
    );
}
