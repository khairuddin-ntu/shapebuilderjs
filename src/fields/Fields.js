import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';

import './Fields.css';

export default function Fields(props) {
    // Parameter states
    const parameters = props.parameters;
    const setParameters = props.setParameters;
    const parameterErrors = props.parameterErrors;
    // Functions state
    const functionInputs = props.functions;
    const setFunctions = props.setFunctions;
    // Button state
    const isShapeLoading = props.isShapeLoading;

    const generateShape = props.generateShape;

    return (
        <Box
            id="fields"
            sx={{ borderTop: 1 }}
        >
            {functionInputs &&
                <FunctionsSection
                    id="functions-section"
                    className="field__section"
                    functions={functionInputs}
                    setFunctions={setFunctions}
                />
            }
            {parameters &&
                <ParametersSection
                    id="parameters-section"
                    className="field__section"
                    parameters={parameters}
                    setParameters={setParameters}
                    parameterErrors={parameterErrors}
                />
            }
            <Box id="actions-section">
                <Button
                    variant="contained"
                    onClick={generateShape}
                    disabled={isShapeLoading}
                >
                    Generate shape
                </Button>
            </Box>
        </Box>
    );
}
