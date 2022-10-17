import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function FunctionField(props) {
    const functionName = props.functionName;
    const funcInput = props.funcInput;
    const setFunction = props.setFunction;

    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{functionName} =</Typography>
            <TextField
                className="function-input"
                variant="outlined"
                inputProps={{ size: 35 }}
                onChange={(event) => setFunction(event.target.value)}
                value={funcInput}
            />
        </Stack>
    );
}
