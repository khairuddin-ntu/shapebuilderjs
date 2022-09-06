import TextField from '@mui/material/TextField';

export default function ParameterInput(props) {
    return (
        <TextField
            defaultValue={props.defaultValue}
            size="small"
            variant="outlined"
            inputProps={{
                inputMode: "numeric",
                size: 8
            }}
        />
    );
}
