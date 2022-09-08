import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';
import ResolutionSection from './ResolutionSection';
import Parameter from './parameters/Parameter';

import './Fields.css';

export const DEFAULT_RESOLUTION = 100;

export default function Fields(props) {
    const [snackbarMessage, setSnackbarMessage] = useState();
    const [resolution, setResolution] = useState(DEFAULT_RESOLUTION);
    const [parameters, setParameters] = useState([new Parameter("u"), new Parameter("v")]);
    const [parametersError, setParametersError] = useState();

    const generateShape = () => {
        if (parametersError) {
            setSnackbarMessage(parametersError);
            return;
        }

        if (isNaN(resolution)) {
            setSnackbarMessage(resolution);
            return;
        }

        props.setRenderParams({ parameters: parameters, resolution: resolution });
    };

    return (
        <Box
            id="fields"
            sx={{ borderTop: 1 }}
        >
            <FunctionsSection id="functions-section" className="field__section" sectionName="Functions" />
            <ParametersSection
                id="parameters-section"
                className="field__section"
                sectionName="Parameters"
                parameters={parameters}
                setParameters={setParameters}
                setParametersError={setParametersError}
            />
            <ResolutionSection
                id="resolution-section"
                setResolution={setResolution}
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
