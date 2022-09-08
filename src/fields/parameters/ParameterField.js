import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ParameterInput from './ParameterInput';

export default function ParameterField(props) {
    const parameter = props.parameter;

    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{parameter.name} = [</Typography>
            <ParameterInput defaultValue={parameter.min} />
            <Typography className="input-label">,</Typography>
            <ParameterInput defaultValue={parameter.max} />
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
