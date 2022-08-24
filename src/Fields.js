import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Functions from './Functions';

import './Fields.css';

export default function Fields() {
    return (
        <Box
            id="fields-section"
            sx={{ borderTop: 1 }}
        >
            <Box id="functions-section">
                <Functions />
            </Box>
            <Box id="parameters-section"></Box>
            <Box id="resolution-section">
                <p>Resolution =</p>
                <TextField
                    variant="outlined"
                    type="number"
                />
            </Box>
            <Box id="actions-section"></Box>
        </Box>
    );
}
