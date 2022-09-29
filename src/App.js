import { useState } from 'react';
import Box from '@mui/material/Box';
import Parameter from './common/Parameter';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import parseFunctionInput from './fields/functions/parser/FunctionParser';
import Operators from './operators/Operators';

import './App.css';

export default function App() {
    const params = [new Parameter("u"), new Parameter("v")];
    const [renderParams, setRenderParams] = useState({
        functions: [
            parseFunctionInput(params, "2.5cos(-pi/2+u*pi)cos(-pi+2v*pi)")[0],
            parseFunctionInput(params, "2.5cos(-pi/2+u*pi)sin(-pi+2v*pi)")[0],
            parseFunctionInput(params, "2.5sin(-pi/2+u*pi)")[0],
        ],
        parameters: params
    });

    return (
        <Box id="app">
            <Scene renderParams={renderParams} />
            <Operators id="operators" />
            <Fields setRenderParams={setRenderParams} />
        </Box>
    );
}

