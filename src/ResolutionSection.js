import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function ResolutionSection(props) {
    return (
        <Stack {...props} direction="row" alignItems="center">
            <Typography>Resolution =</Typography>
            <TextField
                variant="outlined"
                type="number"
                inputProps={{
                    min: 0,
                    max: 999,
                    step: 1
                }}
            />
        </Stack>
    );
}