import { useState } from 'react';
import Box from '@mui/material/Box';
import { DEFAULT_RESOLUTION } from './common/Constants';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import Operators from './operators/Operators';
import Parameter from './fields/parameters/Parameter';

import './App.css';

export default function App() {
    const [renderParams, setRenderParams] = useState({ parameters: [new Parameter("u"), new Parameter("v")], resolution: DEFAULT_RESOLUTION });

    return (
        <Box id="app">
            <Scene renderParams={renderParams} />
            <Operators id="operators" />
            <Fields setRenderParams={setRenderParams} />
        </Box>
    );
}

