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
        this.renderer.render2dShape(
            (u) => 10 * u * Math.cos(22 * Math.PI * u),
            (u) => 10 * u * Math.sin(22 * Math.PI * u),
            (u) => (10 * u) - 5,
            {
                start: 0, end: 1, get range() { return this.end - this.start }
            },
            200
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