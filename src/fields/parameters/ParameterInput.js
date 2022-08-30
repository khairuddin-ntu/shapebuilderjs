import TextField from '@mui/material/TextField';

export default function ParameterInput() {
    return (
        <TextField
            size="small"
            variant="outlined"
            inputProps={{
                inputMode: "numeric",
                size: 8
            }}
        />
    );
}