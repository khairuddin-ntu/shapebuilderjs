import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Scene from './render/Scene';
import Fields from './fields/Fields';
import parseFunctionInput from './fields/functions/parser/FunctionParser';
import Templates from './templates/TemplatesSection';
import Parameter from './common/Parameter';
import { FUNCTION_NAMES } from './common/Constants';
import { isEmptyOrBlank } from './common/StringUtils';
import { SnackbarError, SnackbarSuccess } from './common/SnackbarMessage';

import './App.css';

export default function App() {
    const [snackbarMessage, setSnackbarMessage] = useState();

    const [functionInputs, setFunctions] = useState(
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
            parseFunctionInput(parameters, functionInputs[0])[0],
            parseFunctionInput(parameters, functionInputs[1])[0],
            parseFunctionInput(parameters, functionInputs[2])[0],
        ],
        parameters: parameters
    });

    const generateShape = () => {
        setSnackbarMessage(null);

        for (const paramError of parameterErrors.current) {
            if (!paramError) continue;
            setSnackbarMessage(paramError);
            return;
        }

        const functions = [];
        let functionName;
        const startTime = Date.now();
        for (const [i, funcInput] of functionInputs.entries()) {
            functionName = FUNCTION_NAMES[i];

            if (isEmptyOrBlank(funcInput)) {
                setSnackbarMessage(new SnackbarError("Function " + functionName + " cannot be blank"));
                return;
            }

            const [func, errorMessage] = parseFunctionInput(parameters, funcInput);
            if (errorMessage) {
                setSnackbarMessage(new SnackbarError(errorMessage));
                return;
            }

            if (!func) {
                setSnackbarMessage(new SnackbarError("Unknown error while parsing function " + functionName));
                return;
            }

            functions.push(func);
        }
        console.log("Time taken to parse functions = " + (Date.now() - startTime) + "ms");

        setSnackbarMessage(new SnackbarSuccess("Successfully rendered shape"));
        setRenderParams({ functions: functions, parameters: parameters });
    };

    const applyTemplate = (templateItem) => {
        setFunctions(templateItem.functionInputs);
        setParameters(templateItem.parameters);
        parameterErrors.current = [null, null, null];
    };

    return (
        <Box id="app">
            <Templates id="templates" applyTemplate={applyTemplate} />
            <Scene renderParams={renderParams} />
            <Fields
                functions={functionInputs}
                setFunctions={setFunctions}
                parameters={parameters}
                setParameters={setParameters}
                parameterErrors={parameterErrors}
                generateShape={generateShape}
            />
            {
                snackbarMessage &&
                <Snackbar
                    open
                    autoHideDuration={6000}
                    onClose={() => setSnackbarMessage(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <MuiAlert elevation={6} variant="filled" severity={snackbarMessage.type}>
                        {snackbarMessage.message}
                    </MuiAlert>
                </Snackbar>
            }
        </Box>
    );
}

