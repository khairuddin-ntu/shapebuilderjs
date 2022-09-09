import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DEFAULT_RESOLUTION } from './../common/Constants';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';
import ResolutionSection from './ResolutionSection';
import Parameter from './../common/Parameter';

import './Fields.css';

export default function Fields(props) {
    const [snackbarMessage, setSnackbarMessage] = useState();
    // Resolution states
    const resolution = useRef(DEFAULT_RESOLUTION);
    const resolutionError = useRef();
    // Parameter states
    const parameters = useRef([new Parameter("u"), new Parameter("v")]);
    const parameterErrors = useRef([null, null, null]);

    const generateShape = () => {
        for (const paramError of parameterErrors.current) {
            if (!paramError) continue;
            setSnackbarMessage(paramError);
            return;
        }

        const resError = resolutionError.current;
        if (resError) {
            setSnackbarMessage(resError);
            return;
        }

        props.setRenderParams({
            xEquation: (u, v) => 5 * Math.cos(2 * Math.PI * u),
            yEquation: (u, v) => 5 * Math.sin(2 * Math.PI * u),
            zEquation: (u, v) => (11 * v) - 5,
            parameters: parameters.current,
            resolution: resolution.current
        });
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
                parameterErrors={parameterErrors}
            />
            <ResolutionSection
                id="resolution-section"
                resolution={resolution}
                resolutionError={resolutionError}
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
