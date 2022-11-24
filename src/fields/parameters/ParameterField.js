import { useEffect, useState } from 'react';
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
    const index = props.index;
    const parameter = props.parameter;
    const parameterErrors = props.parameterErrors;

    const [parameterInputs, setParameterInputs] = useState(
        [parameter.start.toString(), parameter.end.toString(), parameter.resolution.toString()]
    );
    const [minHasError, setMinHasError] = useState(false);
    const [maxHasError, setMaxHasError] = useState(false);
    const [resolutionHasError, setResolutionHasError] = useState(false);

    useEffect(() => {
        setParameterInputs(
            [parameter.start.toString(), parameter.end.toString(), parameter.resolution.toString()]
        );
        setMinHasError(false);
        setMaxHasError(false);
        setResolutionHasError(false);
    }, [parameter]);

    const updateMin = (strMin) => {
        const newInputs = [...parameterInputs];
        newInputs[0] = strMin;
        setParameterInputs(newInputs);

        if (!REGEX_PARAMETER.test(strMin)) {
            parameterErrors.current[index] = new SnackbarError(
                `Parameter ${parameter.name}: Minimum value contains invalid characters`
            );
            setMinHasError(true);
            return;
        }

        const paramMin = +strMin;
        if (paramMin >= parameter.end) {
            parameterErrors.current[index] = new SnackbarError(
                `Parameter ${parameter.name}: Minimum value cannot be the same or larger than maximum value`
            );
            setMinHasError(true);
            return;
        }

        parameterErrors.current[index] = null;
        setMinHasError(false);
        parameter.start = paramMin;
    };

    const updateMax = (strMax) => {
        const newInputs = [...parameterInputs];
        newInputs[1] = strMax;
        setParameterInputs(newInputs);

        if (!REGEX_PARAMETER.test(strMax)) {
            parameterErrors.current[index] = new SnackbarError(
                `Parameter ${parameter.name}: Maximum value contains invalid characters`
            );
            setMaxHasError(true);
            return;
        }

        const paramMax = +strMax;
        if (paramMax <= parameter.start) {
            parameterErrors.current[index] = new SnackbarError(
                `Parameter ${parameter.name}: Maximum value cannot be the same or smaller than maximum value`
            );
            setMinHasError(true);
            return;
        }

        parameterErrors.current[index] = null;
        setMaxHasError(false);
        parameter.end = paramMax;
    };

    const updateResolution = (strResolution) => {
        const newInputs = [...parameterInputs];
        newInputs[2] = strResolution;
        setParameterInputs(newInputs);

        // Check if resolution only contains digits
        if (!REGEX_RESOLUTION.test(strResolution)) {
            setResolutionHasError(true);
            parameterErrors.current[index] = new SnackbarError(
                `Parameter ${parameter.name}: Resolution must only contain digits`
            );
            return;
        }

        const resolution = +strResolution;
        // Check if resolution is less than minimum allowed resolution
        if (resolution < MIN_RESOLUTION) {
            setResolutionHasError(true);
            parameterErrors.current[index] = new SnackbarError(
                `Parameter ${parameter.name}: Resolution cannot be less than ${MIN_RESOLUTION}`
            );
            return;
        }

        // Check if resolution is more than maximum allowed resolution
        if (resolution > MAX_RESOLUTION) {
            setResolutionHasError(true);
            parameterErrors.current[index] = new SnackbarError(
                `Parameter ${parameter.name}: Resolution cannot be more than ${MAX_RESOLUTION}`
            );
            return;
        }

        setResolutionHasError(false);
        parameterErrors.current[index] = null;
        parameter.resolution = resolution;
    };

    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{parameter.name} = [</Typography>
            <ParameterInput
                value={parameterInputs[0]}
                onChange={updateMin}
                hasError={minHasError}
            />
            <Typography className="input-label">,</Typography>
            <ParameterInput
                value={parameterInputs[1]}
                onChange={updateMax}
                hasError={maxHasError}
            />
            <Typography className="input-label">],</Typography>
            <ResolutionInput
                value={parameterInputs[2]}
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
