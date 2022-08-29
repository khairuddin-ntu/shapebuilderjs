import Box from '@mui/material/Box';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import Operators from './operators/Operators';

import './App.css';

export default function App() {
    return (
        <Box id="app">
            <Scene />
            <Operators id="operators" />
            <Fields />
        </Box>
    );
}

