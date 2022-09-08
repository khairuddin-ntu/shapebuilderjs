import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ParameterInput from './ParameterInput';

export default function ParameterField(props) {
    const parameter = props.parameter;

    const updateMin = (strMin) => {
        console.log("updateMin: min value changed to", strMin);
    };

    const updateMax = (strMax) => {
        console.log("updateMax: max value changed to", strMax);
    };

    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{parameter.name} = [</Typography>
            <ParameterInput
                defaultValue={parameter.min}
                onChange={updateMin}
            />
            <Typography className="input-label">,</Typography>
            <ParameterInput
                defaultValue={parameter.max}
                onChange={updateMax}
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
