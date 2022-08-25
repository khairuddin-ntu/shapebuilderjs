import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FunctionsSection from './FunctionsSection';
import ParametersSection from './ParametersSection';

import './Fields.css';

export default function Fields() {
    return (
        <Box
            id="fields-section"
            sx={{ borderTop: 1 }}
        >
            <Box id="functions-section">
                <FunctionsSection />
            </Box>
            <Box id="parameters-section">
                <ParametersSection />
            </Box>
            <Box id="resolution-section">
                <Stack direction="row">
                    <p>Resolution =</p>
                    <TextField
                        variant="outlined"
                        type="number"
                    />
                </Stack>
            </Box>
            <Box id="actions-section"></Box>
        </Box>
    );
}
