import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';
import ResolutionSection from './ResolutionSection'

import './Fields.css';

const MAX_RESOLUTION = 2048;

export default function Fields(props) {
    const resolutionInput = useRef("100");

    const parseResolution = (strResolution) => {
        // Check if resolution only contains digits
        if (!/^\d+$/.test(strResolution)) {
            return NaN;
        }

        const resolution = +strResolution;
        // Check if resolution is more than 999
        return resolution > MAX_RESOLUTION ? NaN : resolution;
    };

    const generateShape = () => {
        const resolution = parseResolution(resolutionInput.current);
        console.log("generateShape: Parsed value of resolution field = ", resolution);
    };

    return (
        <Box
            id="fields"
            sx={{ borderTop: 1 }}
        >
            <FunctionsSection id="functions-section" className="field__section" sectionName="Functions" />
            <ParametersSection id="parameters-section" className="field__section" sectionName="Parameters" />
            <ResolutionSection id="resolution-section" resolutionRef={resolutionInput} />
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
