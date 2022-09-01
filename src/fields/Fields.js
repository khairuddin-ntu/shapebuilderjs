import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';
import ResolutionSection from './ResolutionSection'

import './Fields.css';

export const DEFAULT_RESOLUTION = "100";
const MAX_RESOLUTION = 2048;
const REGEX_RESOLUTION = /^\d+$/;

export default function Fields(props) {
    const [snackbarMessage, setSnackbarMessage] = useState(null);

    const resolutionInput = useRef(DEFAULT_RESOLUTION);
    const [resolutionError, setResolutionError] = useState(false);

    const onResolutionChange = (resolution) => {
        setResolutionError(false);
        resolutionInput.current = resolution;
    };

    const parseResolution = (strResolution) => {
        // Check if resolution only contains digits
        if (!REGEX_RESOLUTION.test(strResolution)) {
            setResolutionError(true);
            setSnackbarMessage({ type: "error", text: "Resolution must only contain digits" });
            return null;
        }

        const resolution = +strResolution;
        // Check if resolution is 0
        if (resolution === 0) {
            setResolutionError(true);
            setSnackbarMessage({ type: "error", text: "Resolution cannot be 0" });
            return null;
        }

        // Check if resolution is more than maximum allowed resolution
        if (resolution > MAX_RESOLUTION) {
            setResolutionError(true);
            setSnackbarMessage({ type: "error", text: "Resolution cannot be more than " + MAX_RESOLUTION });
            return null;
        }

        return resolution;
    };

    const generateShape = () => {
        console.log("generateShape: Recorded resolution input = ", resolutionInput.current);
        const resolution = parseResolution(resolutionInput.current);
        if (resolution === null) {
            return;
        }

        console.log("generateShape: Parsed value of resolution field = ", resolution);
        props.setRenderParams({ resolution: resolution });
    };

    return (
        <Box
            id="fields"
            sx={{ borderTop: 1 }}
        >
            <FunctionsSection id="functions-section" className="field__section" sectionName="Functions" />
            <ParametersSection id="parameters-section" className="field__section" sectionName="Parameters" />
            <ResolutionSection
                id="resolution-section"
                onResolutionChange={onResolutionChange}
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
                snackbarMessage != null ?
                    <Snackbar
                        open
                        autoHideDuration={6000}
                        onClose={() => setSnackbarMessage(null)}
                    >
                        <MuiAlert elevation={6} variant="filled" severity={snackbarMessage.type}>
                            {snackbarMessage.text}
                        </MuiAlert>
                    </Snackbar>
                    : null
            }
        </Box>
    );
}
