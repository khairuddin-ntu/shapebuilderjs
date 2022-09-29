import { useState } from 'react';
import Box from '@mui/material/Box';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import parseFunctionInput from './fields/functions/parser/FunctionParser';
import Operators from './operators/Operators';
import Parameter from './common/Parameter';
import { DEFAULT_FUNCTIONS } from './common/Constants';

import './App.css';

export default function App() {
    const params = [new Parameter("u"), new Parameter("v")];
    const [renderParams, setRenderParams] = useState({
        functions: [
            parseFunctionInput(params, DEFAULT_FUNCTIONS[0])[0],
            parseFunctionInput(params, DEFAULT_FUNCTIONS[1])[0],
            parseFunctionInput(params, DEFAULT_FUNCTIONS[2])[0],
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

