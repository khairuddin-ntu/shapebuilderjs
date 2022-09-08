import { useState } from 'react';
import Box from '@mui/material/Box';
import { DEFAULT_RESOLUTION } from './common/Constants';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import Operators from './operators/Operators';
import Parameter from './fields/parameters/Parameter';

import './App.css';

export default function App() {
    const [renderParams, setRenderParams] = useState({
        xEquation: (u, v) => 5 * Math.cos(2 * Math.PI * u),
        yEquation: (u, v) => 5 * Math.sin(2 * Math.PI * u),
        zEquation: (u, v) => (11 * v) - 5,
        parameters: [new Parameter("u"), new Parameter("v")],
        resolution: DEFAULT_RESOLUTION
    });

    return (
        <Box id="app">
            <Scene renderParams={renderParams} />
            <Operators id="operators" />
            <Fields setRenderParams={setRenderParams} />
        </Box>
    );
}

