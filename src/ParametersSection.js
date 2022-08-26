import Stack from '@mui/material/Stack';
import ParameterField from './ParameterField';
import Button from '@mui/material/Button';
import AddRounded from '@mui/icons-material/AddRounded';

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
            <Button startIcon={<AddRounded />}>Add parameter</Button>
        </Stack>
    );
}
