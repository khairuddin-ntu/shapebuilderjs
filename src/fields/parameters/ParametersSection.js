import { useState } from 'react';
import Stack from '@mui/material/Stack';
import ParameterField from './ParameterField';
import Button from '@mui/material/Button';
import AddRounded from '@mui/icons-material/AddRounded';
import Parameter from './Parameter';

export default function ParametersSection(props) {
    const [canAddParam, setCanAddParam] = useState(true);

    const parameters = props.parameters;
    const setParameters = props.setParameters;

    const addParameter = () => {
        const paramNames = parameters.map((param) => param.name);
        if (!paramNames.includes("v")) {
            setParameters(
                [...parameters, new Parameter("v")].sort(
                    (paramA, paramB) => {
                        if (paramA.name < paramB.name) {
                            return -1;
                        }

                        if (paramA.name > paramB.name) {
                            return 1;
                        }

                        return 0;
                    }
                )
            );
        } else {
            setParameters([...parameters, new Parameter("w")]);
        }

        if (paramNames.length === 2) {
            setCanAddParam(false);
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
