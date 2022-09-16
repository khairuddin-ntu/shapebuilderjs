import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';
import Parameter from './../common/Parameter';

import './Fields.css';

export default function Fields(props) {
    const [snackbarMessage, setSnackbarMessage] = useState();
    // Parameter states
    const parameters = useRef([new Parameter("u"), new Parameter("v")]);
    const parameterErrors = useRef([null, null, null]);

    const generateShape = () => {
        setSnackbarMessage(null);

        for (const paramError of parameterErrors.current) {
            if (!paramError) continue;
            setSnackbarMessage(paramError);
            return;
        }

        props.setRenderParams({
            xEquation: (u, v) => 2.5 * Math.cos(-Math.PI / 2 + u * Math.PI) * Math.cos(-Math.PI + v * 2 * Math.PI),
            yEquation: (u, v) => 2.5 * Math.cos(-Math.PI / 2 + u * Math.PI) * Math.sin(-Math.PI + v * 2 * Math.PI),
            zEquation: (u, v) => 2.5 * Math.sin(-Math.PI / 2 + u * Math.PI),
            parameters: parameters.current
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
