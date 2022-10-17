import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function ResolutionInput(props) {
    const [size, setSize] = useState(2);

    const onUpdate = (event) => {
        const strInput = event.target.value;
        setSize(Math.max(2, strInput.length - 1));
        props.onChange(strInput);
    };

    return (
        <React.Fragment>
            <Typography className="input-label">Resolution =</Typography>
            <TextField
                size="small"
                variant="outlined"
                value={props.value}
                error={props.hasError}
                inputProps={{ size: size }}
                onChange={onUpdate}
            />
        </React.Fragment>
    );
}
