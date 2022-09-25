import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';
import parseFunctionInput from './functions/parser/FunctionParser';
import Parameter from './../common/Parameter';
import { SnackbarError } from './../common/SnackbarMessage';
import { FUNCTION_NAMES } from '../common/Constants';
import { isEmptyOrBlank } from '../common/StringUtils';

import './Fields.css';

export default function Fields(props) {
    const [snackbarMessage, setSnackbarMessage] = useState();
    // Parameter states
    const parameters = useRef([new Parameter("u"), new Parameter("v")]);
    const parameterErrors = useRef([null, null, null]);
    // Functions state
    const functionInputs = useRef(["", "", ""]);

    const generateShape = () => {
        setSnackbarMessage(null);

        for (const paramError of parameterErrors.current) {
            if (!paramError) continue;
            setSnackbarMessage(paramError);
            return;
        }

        const params = parameters.current;

        const functions = [];
        let functionName;
        for (const [i, funcInput] of functionInputs.current.entries()) {
            functionName = FUNCTION_NAMES[i];

            if (isEmptyOrBlank(funcInput)) {
                setSnackbarMessage(new SnackbarError("Function " + functionName + " cannot be blank"));
                return;
            }

            const [func, errorMessage] = parseFunctionInput(params, funcInput);
            if (errorMessage) {
                setSnackbarMessage(new SnackbarError(errorMessage));
                return;
            }

            if (!func) {
                setSnackbarMessage(new SnackbarError("Unknown error while parsing function", functionName));
                return;
            }

            functions.push(func);
        }

        props.setRenderParams({
            xEquation: (u, v) => 2.5 * Math.cos(-Math.PI / 2 + u * Math.PI) * Math.cos(-Math.PI + v * 2 * Math.PI),
            yEquation: (u, v) => 2.5 * Math.cos(-Math.PI / 2 + u * Math.PI) * Math.sin(-Math.PI + v * 2 * Math.PI),
            zEquation: (u, v) => 2.5 * Math.sin(-Math.PI / 2 + u * Math.PI),
            parameters: params
        });
    };

    return (
        <Box
            id="fields"
            sx={{ borderTop: 1 }}
        >
            <FunctionsSection
                id="functions-section"
                className="field__section"
                sectionName="Functions"
                functionsRef={functionInputs}
            />
            <ParametersSection
                id="parameters-section"
                className="field__section"
                sectionName="Parameters"
                parameters={parameters}
                parameterErrors={parameterErrors}
            />
            <Box id="actions-section">
                <Button
                    variant="contained"
                    onClick={generateShape}
                >
                    Generate shape
                </Button>
            </Box>
            {
                snackbarMessage ?
                    <Snackbar
                        open
                        autoHideDuration={6000}
                        onClose={() => setSnackbarMessage(null)}
                    >
                        <MuiAlert elevation={6} variant="filled" severity={snackbarMessage.type}>
                            {snackbarMessage.message}
                        </MuiAlert>
                    </Snackbar>
                    : null
            }
        </Box>
    );
}
