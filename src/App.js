import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import parseFunctionInput from './fields/functions/parser/FunctionParser';
import Templates from './templates/TemplatesSection';
import Parameter from './common/Parameter';

import './App.css';

export default function App() {
    const [functions, setFunctions] = useState(
        [
            "2.5cos(-pi/2+u*pi)cos(-pi+2v*pi)",
            "2.5cos(-pi/2+u*pi)sin(-pi+2v*pi)",
            "2.5sin(-pi/2+u*pi)"
        ]
    );

    const [parameters, setParameters] = useState(
        [new Parameter("u"), new Parameter("v")]
    );

    const parameterErrors = useRef([null, null, null]);

    const [renderParams, setRenderParams] = useState({
        functions: [
            parseFunctionInput(parameters, functions[0])[0],
            parseFunctionInput(parameters, functions[1])[0],
            parseFunctionInput(parameters, functions[2])[0],
        ],
        parameters: parameters
    });

    const applyTemplate = (templateItem) => {
        console.log(templateItem);
        setFunctions(templateItem.functionInputs);
        setParameters(templateItem.parameters);
    };

    return (
        <Box id="app">
            <Templates id="templates" applyTemplate={applyTemplate} />
            <Scene renderParams={renderParams} />
            <Fields
                functions={functions}
                setFunctions={setFunctions}
                parameters={parameters}
                setParameters={setParameters}
                parameterErrors={parameterErrors}
                setRenderParams={setRenderParams}
            />
        </Box>
    );
}

