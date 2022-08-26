import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import './Operators.css';

export default function Operators(props) {
    return (
        <Box {...props} sx={{ borderLeft: 1 }}>
            <Typography variant="h4">Operators</Typography>
        </Box>
    );
}
