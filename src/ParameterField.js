import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ParameterInput from './ParameterInput';

export default function ParameterField(props) {
    return (
        <Stack direction="row" alignItems="center">
            <Typography className="input-label">{props.parameterName} = [</Typography>
            <ParameterInput />
            <Typography className="input-label">,</Typography>
            <ParameterInput />
            <Typography className="input-label">]</Typography>
        </Stack>
    );
}
