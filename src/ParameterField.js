import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function ParameterField(props) {
    return (
        <Stack direction="row" alignItems="center">
            <Typography>{props.parameterName} = [</Typography>
            <TextField
                class="parameter-input"
                variant="outlined"
                type="number"
            />
            <Typography>,</Typography>
            <TextField
                class="parameter-input"
                variant="outlined"
                type="number"
            />
            <Typography>]</Typography>
        </Stack>
    );
}
