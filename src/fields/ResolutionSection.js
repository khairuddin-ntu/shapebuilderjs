import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function ResolutionSection(props) {
    const onResolutionChange = (event) => props.resolutionRef.current = event.target.value;

    return (
        <Stack
            id={props.id}
            direction="row"
            alignItems="center"
        >
            <Typography className="input-label">Resolution =</Typography>
            <TextField
                size="small"
                variant="outlined"
                type="number"
                defaultValue="100"
                inputProps={{
                    min: 0,
                    max: 999,
                    step: 1
                }}
                onChange={onResolutionChange}
            />
        </Stack>
    );
}