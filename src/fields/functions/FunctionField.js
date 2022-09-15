import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function FunctionField(props) {
    const index = props.index;
    const inputsRef = props.inputsRef;

    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{props.functionName} =</Typography>
            <TextField
                className="function-input"
                variant="outlined"
                inputProps={{ size: 40 }}
                onChange={(event) => inputsRef.current[index] = event.target.value}
            />
        </Stack>
    );
}
