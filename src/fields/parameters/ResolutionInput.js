import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function ResolutionInput(props) {
    return (
        <React.Fragment
            direction="row"
            alignItems="center"
        >
            <Typography className="input-label">Increment =</Typography>
            <TextField
                size="small"
                variant="outlined"
                type="number"
                defaultValue={props.defaultValue}
                error={props.hasError}
                inputProps={{
                    min: 0,
                    max: 999,
                    step: 1
                }}
                onChange={(event) => props.onChange(event.target.value)}
            />
        </React.Fragment>
    );
}
