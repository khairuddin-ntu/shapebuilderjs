import React from 'react';
import ShapeRenderer from './ShapeRenderer';

import './Scene.css';

export default class Scene extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    // ******************* COMPONENT LIFECYCLE ******************* //
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
    }

    render() {
        return (<canvas id="scene-canvas" ref={this.canvasRef} />);
    }
}