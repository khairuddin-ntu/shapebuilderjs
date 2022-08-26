import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function FunctionField(props) {
    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{props.functionName} =</Typography>
            <TextField
                class="function-input"
                variant="outlined"
                inputProps={{ size: 40 }}
            />
        </Stack>
    );
}
