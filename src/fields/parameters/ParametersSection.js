import { useState } from 'react';
import Stack from '@mui/material/Stack';
import ParameterField from './ParameterField';
import Button from '@mui/material/Button';
import AddRounded from '@mui/icons-material/AddRounded';
import Parameter from './Parameter';

export default function ParametersSection(props) {
    const [parameters, setParameters] = useState([new Parameter("u")]);
    const [canAddParam, setCanAddParam] = useState(true);

    const addParameter = () => {
        switch (parameters.length) {
            case 1:
                setParameters([...parameters, new Parameter("v")]);
                break;
            case 2:
                setParameters([...parameters, new Parameter("w")]);
                setCanAddParam(false);
                break;
            default:
                break;
        }
    };

    return (
        <Stack
            id={props.id}
            className={props.className}
            direction="column"
            spacing={2}
        >
            {parameters.map((parameter) =>
                <ParameterField
                    parameterName={parameter.name}
                    deletable={parameter.name !== "u"}
                />
            )}
            {canAddParam ? <Button startIcon={<AddRounded />} onClick={addParameter}>Add parameter</Button> : null}
        </Stack>
    );
}
