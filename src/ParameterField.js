import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function ParameterField(props) {
    return (
        <Stack>
            <p>{props.parameterName} = [</p>
            <TextField
                class="parameter-input"
                variant="outlined"
                type="number"
            />
            <p>,</p>
            <TextField
                class="parameter-input"
                variant="outlined"
                type="number"
            />
            <p>]</p>
        </Stack>
    );
}
