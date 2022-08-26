import Stack from '@mui/material/Stack';
import ParameterField from './ParameterField';

export default function ParametersSection(props) {
    return (
        <Stack
        {...props}
        direction="column"
        spacing={2}
        >
            <ParameterField parameterName="u" />
            <ParameterField parameterName="v" />
            <ParameterField parameterName="w" />
        </Stack>
    );
}
