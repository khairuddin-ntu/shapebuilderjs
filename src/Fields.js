import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
                <Stack direction="row" alignItems="center">
                    <Typography>Resolution =</Typography>
                    <TextField
                        variant="outlined"
                        type="number"
                    />
                </Stack>
            </Box>
            <Box id="actions-section">
                <Button variant="contained">Generate shape</Button>
            </Box>
        </Box>
    );
}
