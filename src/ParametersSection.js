import Stack from '@mui/material/Stack';
import ParameterField from './ParameterField';

export default function ParametersSection(props) {
    return (
        <Stack {...props} direction="column">
            <ParameterField parameterName="u" />
            <ParameterField parameterName="v" />
            <ParameterField parameterName="w" />
        </Stack>
    );
}
