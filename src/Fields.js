import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FunctionsSection from './FunctionsSection';
import ParametersSection from './ParametersSection';
import ResolutionSection from './ResolutionSection'

import './Fields.css';

export default function Fields(props) {
    return (
        <Box
            id="fields"
            {...props}
            sx={{ borderTop: 1 }}
        >
            <FunctionsSection id="functions-section" className="field__section" sectionName="Functions" />
            <ParametersSection id="parameters-section" className="field__section" sectionName="Parameters" />
            <ResolutionSection id="resolution-section" />
            <Box id="actions-section">
                <Button variant="contained">Generate shape</Button>
            </Box>
        </Box>
    );
}
