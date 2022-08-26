import { useState } from 'react';
import Stack from '@mui/material/Stack';
import ParameterField from './ParameterField';
import Button from '@mui/material/Button';
import AddRounded from '@mui/icons-material/AddRounded';
import Parameter from './Parameter';

export default function ParametersSection(props) {
    const [parameters, setParameters] = useState([new Parameter("u")]);

    return (
        <Stack
            {...props}
            direction="column"
            spacing={2}
        >
            {parameters.map((parameter) => <ParameterField parameterName={parameter.name} />)}
            <Button startIcon={<AddRounded />}>Add parameter</Button>
        </Stack>
    );
}
