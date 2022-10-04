import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import './Templates.css';

export default function Templates(props) {
    return (
        <Stack
            id={props.id}
            sx={{ borderLeft: 1 }}
        >
            <Typography variant="h4">Templates</Typography>
        </Stack>
    );
}
