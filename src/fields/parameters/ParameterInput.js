import { useState } from 'react';
import TextField from '@mui/material/TextField';

export default function ParameterInput(props) {
    const [size, setSize] = useState(1);

    const onUpdate = (event) => {
        const strInput = event.target.value;
        const inputLength = strInput.length;
        setSize(Math.max(1, inputLength - 1));
        props.onChange(strInput);
    };

    return (
        <TextField
            value={props.value}
            error={props.hasError}
            size="small"
            variant="outlined"
            onChange={onUpdate}
            inputProps={{
                inputMode: "numeric",
                size: size
            }}
        />
    );
}
