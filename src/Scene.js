import React from 'react';
import ShapeRenderer from './ShapeRenderer';

export default class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    // ******************* COMPONENT LIFECYCLE ******************* //
    componentDidMount() {
        // Create renderer
        this.renderer = new ShapeRenderer(this.canvasRef.current);
        this.renderer.renderShape(
            function (t) {
                const a = 0.5; // radius
                return a * Math.sin(t);
            },
            function (t) {
                const b = 0.05; // height per revolution = 2pi * b
                return b * t;
            },
            function (t) {
                const a = 0.5; // radius
                return a * Math.cos(t);
            },
            { start: -10 * Math.PI, end: 10 * Math.PI },
            Math.PI / 128
        );
    }

    render() {
        return (
            <div style={{ backgroundColor: "lightblue" }}>
                <canvas ref={this.canvasRef} />
            </div >
        );
    }
}