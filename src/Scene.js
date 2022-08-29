import React from 'react';
import ShapeRenderer from './ShapeRenderer';

import './Scene.css';

export default class Scene extends React.Component {
    #currentMouseX = -1;
    #currentMouseY = -1;

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    // ******************* COMP`ONENT LIFECYCLE ******************* //
    componentDidMount() {
        // Create renderer
        this.renderer = new ShapeRenderer(this.canvasRef.current);
        //this.renderer.render2dShape(
        //    (u) => 10 * u * Math.cos(22 * Math.PI * u),
        //    (u) => 10 * u * Math.sin(22 * Math.PI * u),
        //    (u) => (10 * u) - 5,
        //    {
        //        start: 0, end: 1, get range() { return this.end - this.start }
        //    },
        //    600
        //);

        this.renderer.render3dShape(
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

        this.canvasRef.current.addEventListener('mousedown', this.#onStartDrag);
    }

    componentWillUnmount() {
        this.canvasRef.current.removeEventListener('mousedown', this.#onStartDrag);
    }

    #onStartDrag = (event) => {
        this.#currentMouseX = event.clientX;
        this.#currentMouseY = event.clientY;

        this.canvasRef.current.removeEventListener('mousedown', this.#onStartDrag);
        this.canvasRef.current.addEventListener('mousemove', this.#onDrag);
        this.canvasRef.current.addEventListener('mouseup', this.#onEndDrag);
        this.canvasRef.current.addEventListener('mouseout', this.#onEndDrag);
    }

    #onDrag = (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const rotationX = mouseX - this.#currentMouseX;
        const rotationY = mouseY - this.#currentMouseY;
        this.renderer.rotateShape(rotationX, rotationY);

        this.#currentMouseX = mouseX;
        this.#currentMouseY = mouseY;
    }

    #onEndDrag = () => {
        this.canvasRef.current.removeEventListener('mousemove', this.#onDrag);
        this.canvasRef.current.removeEventListener('mouseup', this.#onEndDrag);
        this.canvasRef.current.removeEventListener('mouseout', this.#onEndDrag);
        this.canvasRef.current.addEventListener('mousedown', this.#onStartDrag);
    }

    render() {
        return (
        <canvas
        id="canvas"
        {...this.props}
        ref={this.canvasRef} />
        );
    }
}