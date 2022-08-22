import Box from '@mui/material/Box';
import Scene from './Scene.js'

import './App.css';

export default function App() {
    return (
        <Box id="app">
            <Box id="canvas">
                <Scene />
            </Box>
            <Box id="operators">
                {/* TODO: Replace with operators layout */}
                <Box className="sample-box" backgroundColor="lightblue"/>
            </Box>
            <Box id="fields">
                {/* TODO: Replace with text fields layout */}
                <Box className="sample-box" backgroundColor="lightgreen" />
            </Box>
        </Box>
    );
}

