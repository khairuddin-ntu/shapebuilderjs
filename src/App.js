import { useState } from 'react';
import Box from '@mui/material/Box';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import Operators from './operators/Operators';

import './App.css';

export default function App() {
    const [renderParams, setRenderParams] = useState({ resolution: 100 });

    return (
        <Box id="app">
            <Scene renderParams={renderParams} />
            <Operators id="operators" />
            <Fields setRenderParams={setRenderParams} />
        </Box>
    );
}

