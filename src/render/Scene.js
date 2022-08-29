import React, { useRef, useEffect } from 'react';
import ShapeRenderer from './ShapeRenderer';

import './Scene.css';

export default function Scene(props) {
    let currentMouseX;
    let currentMouseY;
    const renderer = useRef();

    const canvasRef = useRef();

    const onStartDrag = (event) => {
        currentMouseX = event.clientX;
        currentMouseY = event.clientY;

        canvasRef.current.removeEventListener('mousedown', onStartDrag);
        canvasRef.current.addEventListener('mousemove', onDrag);
        canvasRef.current.addEventListener('mouseup', onEndDrag);
        canvasRef.current.addEventListener('mouseout', onEndDrag);
    };

    const onDrag = (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const rotationX = mouseX - currentMouseX;
        const rotationY = mouseY - currentMouseY;
        renderer.current.rotateShape(rotationX, rotationY);

        currentMouseX = mouseX;
        currentMouseY = mouseY;
    };
    
    const onEndDrag = () => {
        canvasRef.current.removeEventListener('mousemove', onDrag);
        canvasRef.current.removeEventListener('mouseup', onEndDrag);
        canvasRef.current.removeEventListener('mouseout', onEndDrag);
        canvasRef.current.addEventListener('mousedown', onStartDrag);
    };

    useEffect(() => {
        const canvas = canvasRef.current;

        renderer.current = new ShapeRenderer(canvas);
        renderer.current.render3dShape(
            (u, v) => 5 * Math.cos(2 * Math.PI * u),
            (u, v) => 5 * Math.sin(2 * Math.PI * u),
            (u, v) => (11 * v) - 5,
            {
                start: 0, end: 1, get range() { return this.end - this.start }
            },
            {
                start: 0, end: 1, get range() { return this.end - this.start }
            },
            100
        );

        canvas.addEventListener('mousedown', onStartDrag);
        return () => canvas.removeEventListener('mousedown', onStartDrag);
    }, []);

    return (
        <canvas
            id="canvas"
            {...props}
            ref={canvasRef}
        />
    );
}
