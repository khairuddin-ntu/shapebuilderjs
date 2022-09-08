import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { SnackbarError } from '../../common/SnackbarMessage';
import ParameterInput from './ParameterInput';

const REGEX_PARAMETER = /^[-]?\d+$/;

export default function ParameterField(props) {
    const parameter = props.parameter;
    const [minHasError, setMinHasError] = useState(false);
    const [maxHasError, setMaxHasError] = useState(false);

    const updateMin = (strMin) => {
        if (!REGEX_PARAMETER.test(strMin)) {
            props.parameterErrors.current[props.index] = new SnackbarError("Minimum value for parameter " + parameter.name + " contains invalid characters");
            setMinHasError(true);
            return;
        }

        const paramMin = +strMin;
        if (paramMin >= parameter.end) {
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Minimum value for parameter " + parameter.name + " cannot be the same or larger than maximum value"
            );
            setMinHasError(true);
            return;
        }

        props.parameterErrors.current[props.index] = null;
        setMinHasError(false);
    };

    const updateMax = (strMax) => {
        if (!REGEX_PARAMETER.test(strMax)) {
            props.parameterErrors.current[props.index] = new SnackbarError("Maximum value for parameter " + parameter.name + " contains invalid characters");
            setMaxHasError(true);
            return;
        }

        const paramMax = +strMax;
        if (paramMax <= parameter.start) {
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Maximum value for parameter " + parameter.name + " cannot be the same or smaller than maximum value"
            );
            setMinHasError(true);
            return;
        }

        props.parameterErrors.current[props.index] = null;
        setMaxHasError(false);
    };

    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{parameter.name} = [</Typography>
            <ParameterInput
                defaultValue={parameter.start}
                onChange={updateMin}
                hasError={minHasError}
            />
            <Typography className="input-label">,</Typography>
            <ParameterInput
                defaultValue={parameter.end}
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
