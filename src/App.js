import Box from '@mui/material/Box';
import Scene from './Scene.js'

import './App.css';

export default function App() {
    return (
        <Box
            id="App"
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(3, 1fr)"
            }}
        >
            <Box gridColumn="span 3" gridRow="span 2">
                <Scene />
            </Box>
            <Box gridColumn="span 1" gridRow="span 3">
                {/* TODO: Replace with operators layout */}
                <Box sx={{
                    width: 1,
                    height: 1,
                    backgroundColor: "lightblue"
                }} />
            </Box>
            <Box gridColumn="span 3">
                {/* TODO: Replace with text fields layout */}
                <Box sx={{
                    width: 1,
                    height: 1,
                    backgroundColor: "lightgreen"
                }} />
            </Box>
        </Box>
    );
}

