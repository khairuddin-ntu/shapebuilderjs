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
    }

    render() {
        return (
            <div style={{ backgroundColor: "lightblue" }}>
                <canvas ref={this.canvasRef} />
            </div >
        );
    }
}