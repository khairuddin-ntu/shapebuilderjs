import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FunctionsSection from './functions/FunctionsSection';
import parseFunctionInput from './functions/parser/FunctionParser';
import ParametersSection from './parameters/ParametersSection';
import { SnackbarError, SnackbarSuccess } from '../common/SnackbarMessage';
import { FUNCTION_NAMES } from '../common/Constants';
import { isEmptyOrBlank } from '../common/StringUtils';

import './Fields.css';

export default function Fields(props) {
    const setSnackbarMessage = props.setSnackbarMessage;
    // Parameter states
    const parameters = props.parameters;
    const setParameters = props.setParameters;
    const parameterErrors = props.parameterErrors;
    // Functions state
    const functionInputs = props.functions;
    const setFunctions = props.setFunctions;

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
        props.setRenderParams({ functions: functions, parameters: parameters });
    };

    return (
        <Box
            id="fields"
            sx={{ borderTop: 1 }}
        >
            <FunctionsSection
                id="functions-section"
                className="field__section"
                functions={functionInputs}
                setFunctions={setFunctions}
            />
            <ParametersSection
                id="parameters-section"
                className="field__section"
                parameters={parameters}
                setParameters={setParameters}
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
        </Box>
    );
}
