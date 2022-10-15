import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import ParameterInput from './ParameterInput';
import ResolutionInput from './ResolutionInput';
import { SnackbarError } from '../../common/SnackbarMessage';

const MIN_RESOLUTION = 3, MAX_RESOLUTION = 2048;
const REGEX_PARAMETER = /^[-]?\d+$/;
const REGEX_RESOLUTION = /^\d+$/;

export default function ParameterField(props) {
    const parameter = props.parameter;
    const [minHasError, setMinHasError] = useState(false);
    const [maxHasError, setMaxHasError] = useState(false);
    const [resolutionHasError, setResolutionHasError] = useState(false);

    const updateMin = (strMin) => {
        if (!REGEX_PARAMETER.test(strMin)) {
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Parameter " + parameter.name + ": Minimum value contains invalid characters"
            );
            setMinHasError(true);
            return;
        }

        const paramMin = +strMin;
        if (paramMin >= parameter.end) {
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Parameter " + parameter.name + ": Minimum value cannot be the same or larger than maximum value"
            );
            setMinHasError(true);
            return;
        }

        parameter.start = paramMin;
        props.parameterErrors.current[props.index] = null;
        setMinHasError(false);
    };

    const updateMax = (strMax) => {
        if (!REGEX_PARAMETER.test(strMax)) {
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Parameter " + parameter.name + ": Maximum value contains invalid characters"
            );
            setMaxHasError(true);
            return;
        }

        const paramMax = +strMax;
        if (paramMax <= parameter.start) {
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Parameter " + parameter.name + ": Maximum value cannot be the same or smaller than maximum value"
            );
            setMinHasError(true);
            return;
        }

        parameter.end = paramMax;
        props.parameterErrors.current[props.index] = null;
        setMaxHasError(false);
    };

    const updateResolution = (strResolution) => {
        // Check if resolution only contains digits
        if (!REGEX_RESOLUTION.test(strResolution)) {
            setResolutionHasError(true);
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Parameter " + parameter.name + ": Resolution must only contain digits"
            );
            return;
        }

        const resolution = +strResolution;
        // Check if resolution is less than minimum allowed resolution
        if (resolution < MIN_RESOLUTION) {
            setResolutionHasError(true);
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Parameter " + parameter.name + ": Resolution cannot be less than " + MIN_RESOLUTION
            );
            return;
        }

        // Check if resolution is more than maximum allowed resolution
        if (resolution > MAX_RESOLUTION) {
            setResolutionHasError(true);
            props.parameterErrors.current[props.index] = new SnackbarError(
                "Parameter " + parameter.name + ": Resolution cannot be more than " + MAX_RESOLUTION
            );
            return;
        }

        setResolutionHasError(false);
        parameter.resolution = resolution;
        props.parameterErrors.current[props.index] = null;
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
            <Typography className="input-label">],</Typography>
            <ResolutionInput
                defaultValue={parameter.resolution}
                onChange={updateResolution}
                hasError={resolutionHasError}
            />
            {/* Used visibility property to ensure equal spacing among all parameter fields */}
            <IconButton
                color="error"
                onClick={() => props.deleteParameter(props.index)}
                sx={{ visibility: props.deletable ? "visible" : "hidden" }}
            >
                <DeleteRounded />
            </IconButton>
        </Stack>
    );
}
