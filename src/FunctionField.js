import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function FunctionField(props) {
    return (
        <Stack>
            <p>{props.functionName} =</p>
            <TextField
                class="function-input"
                variant="outlined"
                type="number"
            />
        </Stack>
    );
}
