import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import './TemplatesSection.css';

export default function TemplatesSection(props) {
    return (
        <Stack
            id={props.id}
            sx={{ borderRight: 1 }}
        >
            <Typography variant="h4">Templates</Typography>
        </Stack>
    );
}
