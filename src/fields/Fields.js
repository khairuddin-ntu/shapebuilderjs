import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FunctionsSection from './functions/FunctionsSection';
import ParametersSection from './parameters/ParametersSection';
import ResolutionSection from './ResolutionSection'

import './Fields.css';

export default function Fields(props) {
    const resolutionInput = useRef("100");

    const generateShape = () => {
        console.log("generateShape: Value of resolution field = ", resolutionInput.current);
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
