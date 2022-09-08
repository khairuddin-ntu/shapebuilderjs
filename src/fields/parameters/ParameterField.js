import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ParameterInput from './ParameterInput';

const REGEX_PARAMETER = /^[-]?\d+$/;

export default function ParameterField(props) {
    const parameter = props.parameter;
    const [minHasError, setMinHasError] = useState(false);
    const [maxHasError, setMaxHasError] = useState(false);

    const updateMin = (strMin) => {
        if (!REGEX_PARAMETER.test(strMin)) {
            console.log("updateMin: min value [" + strMin + "] contains invalid characters");
            setMinHasError(true);
            return;
        }

        setMinHasError(false);
    };

    const updateMax = (strMax) => {
        if (!REGEX_PARAMETER.test(strMax)) {
            console.log("updateMax: max value [" + strMax + "] contains invalid characters");
            setMaxHasError(true);
            return;
        }

        console.log("updateMax: max value changed to", strMax);
        setMaxHasError(false);
    };

    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{parameter.name} = [</Typography>
            <ParameterInput
                defaultValue={parameter.min}
                onChange={updateMin}
                hasError={minHasError}
            />
            <Typography className="input-label">,</Typography>
            <ParameterInput
                defaultValue={parameter.max}
                onChange={updateMax}
                hasError={maxHasError}
            />
            <Typography className="input-label">]</Typography>
            {props.deletable ?
                <IconButton color="error" onClick={() => props.deleteParameter(props.index)}>
                    <CloseRounded />
                </IconButton>
                : null
            }
        </Stack>
    );
}
