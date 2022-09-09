import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddRounded from '@mui/icons-material/AddRounded';
import Parameter from './../../common/Parameter';
import ParameterField from './ParameterField';

export default function ParametersSection(props) {
    const [canAddParam, setCanAddParam] = useState(true);

    const parameters = props.parameters;

    const addParameter = () => {
        const params = parameters.current;

        const paramNames = params.map((param) => param.name);
        if (!paramNames.includes("v")) {
            params.push(new Parameter("v"));
            params.sort(
                (paramA, paramB) => {
                    if (paramA.name < paramB.name) {
                        return -1;
                    }

                    if (paramA.name > paramB.name) {
                        return 1;
                    }

                    return 0;
                }
            );
        } else {
            params.push(new Parameter("w"));
        }

        if (paramNames.length === 2) {
            setCanAddParam(false);
        }
    };

    const deleteParameter = (key) => {
        console.log("Deleting parameter at index", key);
        const params = parameters.current;
        params.splice(key, 1);
        setCanAddParam(true);
    };

    return (
        <Stack
            id={props.id}
            className={props.className}
            direction="column"
            spacing={2}
        >
            {parameters.current.map((parameter, i) =>
                <ParameterField
                    key={i}
                    index={i}
                    parameter={parameter}
                    deletable={i !== 0}
                    deleteParameter={deleteParameter}
                    parameterErrors={props.parameterErrors}
                />
            )}
            {canAddParam ? <Button startIcon={<AddRounded />} onClick={addParameter}>Add parameter</Button> : null}
        </Stack>
    );
}
