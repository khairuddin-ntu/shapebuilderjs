import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ParameterInput from './ParameterInput';

export default function ParameterField(props) {
    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{props.parameterName} = [</Typography>
            <ParameterInput defaultValue={0} />
            <Typography className="input-label">,</Typography>
            <ParameterInput defaultValue={1} />
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
