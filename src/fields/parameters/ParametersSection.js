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

    const deleteParameter = (key) => {
        console.log("Deleting parameter at index", key);
        const params = [...parameters];
        params.splice(key, 1);
        setParameters(params);
        setCanAddParam(true);
    }; 

    return (
        <Stack
            id={props.id}
            className={props.className}
            direction="column"
            spacing={2}
        >
            {parameters.map((parameter, i) =>
                <ParameterField
                    key={i}
                    index={i}
                    parameterName={parameter.name}
                    deletable={i !== 0}
                    deleteParameter={deleteParameter}
                />
            )}
            {canAddParam ? <Button startIcon={<AddRounded />} onClick={addParameter}>Add parameter</Button> : null}
        </Stack>
    );
}
