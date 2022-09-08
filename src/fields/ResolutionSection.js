import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { ErrorMessage } from './../common/SnackbarMessage';
import { DEFAULT_RESOLUTION } from './Fields';

const MAX_RESOLUTION = 2048;
const REGEX_RESOLUTION = /^\d+$/;

export default function ResolutionSection(props) {
    const [hasError, setHasError] = useState(false);

    const onResolutionChange = (event) => {
        const resolutionInput = event.target.value;
        props.setResolution(parseResolution(resolutionInput));
    };

    const parseResolution = (strResolution) => {
        // Check if resolution only contains digits
        if (!REGEX_RESOLUTION.test(strResolution)) {
            setHasError(true);
            return new ErrorMessage("Resolution must only contain digits");
        }

        const resolution = +strResolution;
        // Check if resolution is 0
        if (resolution === 0) {
            setHasError(true);
            return new ErrorMessage("Resolution cannot be 0");
        }

        // Check if resolution is more than maximum allowed resolution
        if (resolution > MAX_RESOLUTION) {
            setHasError(true);
            return new ErrorMessage("Resolution cannot be more than " + MAX_RESOLUTION);
        }

        setHasError(false);
        return resolution;
    }

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
                defaultValue={DEFAULT_RESOLUTION}
                error={hasError}
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