import { useState } from 'react';
import Box from '@mui/material/Box';
import Parameter from './common/Parameter';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import Operators from './operators/Operators';

import './App.css';

export default function App() {
    const [renderParams, setRenderParams] = useState({
        xEquation: (u, v) => 2.5 * Math.cos(-Math.PI / 2 + u * Math.PI) * Math.cos(-Math.PI + v * 2 * Math.PI),
        yEquation: (u, v) => 2.5 * Math.cos(-Math.PI / 2 + u * Math.PI) * Math.sin(-Math.PI + v * 2 * Math.PI),
        zEquation: (u, v) => 2.5 * Math.sin(-Math.PI / 2 + u * Math.PI),
        parameters: [new Parameter("u"), new Parameter("v")]
    });

    return (
        <Box id="app">
            <Scene renderParams={renderParams} />
            <Operators id="operators" />
            <Fields setRenderParams={setRenderParams} />
        </Box>
    );
}

