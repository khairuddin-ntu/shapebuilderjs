import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function FunctionField(props) {
    return (
        <React.Fragment>
            <Grid item xs={1}>
                <p>{props.functionName} =</p>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    class="function-input"
                    variant="outlined"
                    type="number"
                />
            </Grid>
        </React.Fragment>
    );
}
