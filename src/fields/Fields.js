import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';
import ResolutionSection from './ResolutionSection'

import './Fields.css';

const MAX_RESOLUTION = 2048;
const REGEX_RESOLUTION = /^\d+$/;

export default function Fields(props) {
    const resolutionInput = useRef("100");
    const [resolutionError, setResolutionError] = useState(false);

    const onResolutionChange = (resolution) => {
        setResolutionError(false);
        resolutionInput.current = resolution;
    };

    const parseResolution = (strResolution) => {
        // Check if resolution only contains digits
        if (!REGEX_RESOLUTION.test(strResolution)) {
            console.log("parseResolution: Must only contain digits");
            setResolutionError(true);
            return null;
        }

        const resolution = +strResolution;
        // Check if resolution is 0
        if (resolution === 0) {
            console.log("parseResolution: Cannot be 0");
            setResolutionError(true);
            return null;
        }

        // Check if resolution is more than maximum allowed resolution
        if (resolution > MAX_RESOLUTION) {
            console.log("parseResolution: Cannot be more than " + MAX_RESOLUTION);
            setResolutionError(true);
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
        </Box>
    );
}
