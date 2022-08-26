import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FunctionsSection from './FunctionsSection';
import ParametersSection from './ParametersSection';
import ResolutionSection from './ResolutionSection'

import './Fields.css';

export default function Fields(props) {
    return (
        <Box
            {...props}
            sx={{ borderTop: 1 }}
        >
            <FunctionsSection id="functions-section" />
            <ParametersSection id="parameters-section" />
            <ResolutionSection id="resolution-section" />
            <Box id="actions-section">
                <Button variant="contained">Generate shape</Button>
            </Box>
        </Box>
    );
}
