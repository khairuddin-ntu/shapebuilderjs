import Box from '@mui/material/Box';
import Scene from './Scene';
import Fields from './Fields';
import Operators from './Operators';

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

