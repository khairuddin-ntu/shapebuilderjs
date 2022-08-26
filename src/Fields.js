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
            <Box id="functions-section">
                <FunctionsSection />
            </Box>
            <Box id="parameters-section">
                <ParametersSection />
            </Box>
            <Box id="resolution-section">
                <ResolutionSection />
            </Box>
            <Box id="actions-section">
                <Button variant="contained">Generate shape</Button>
            </Box>
        </Box>
    );
}
