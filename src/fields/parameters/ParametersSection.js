import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddRounded from '@mui/icons-material/AddRounded';
import ParameterField from './ParameterField';
import Parameter from '../../common/Parameter';
import { Typography } from '@mui/material';

export default function ParametersSection(props) {
    const [canAddParam, setCanAddParam] = useState(true);

    const parameters = props.parameters;
    const setParameters = props.setParameters;

    const addParameter = () => {
        if (!parameters.some((param) => param.name === "v")) {
            const newParams = [...parameters, new Parameter("v")];
            newParams.sort(
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
            setParameters(newParams);
        } else {
            setParameters([...parameters, new Parameter("w")]);
        }

        if (parameters.length === 2) {
            setCanAddParam(false);
        }
    };

    const deleteParameter = (key) => {
        setParameters(parameters.slice(0, key).concat(parameters.slice(key + 1)));
        setCanAddParam(true);
    };

    return (
        <Box id={props.id}>
            <Typography variant="h6">Parameters</Typography>
            <Stack
                className={props.className}
                spacing={2}
            >
                {parameters.map((parameter, i) =>
                    <ParameterField
                        key={i}
                        index={i}
                        parameter={parameter}
                        deletable={i === parameters.length - 1}
                        deleteParameter={deleteParameter}
                        parameterErrors={props.parameterErrors}
                    />
                )}
                {canAddParam ? <Button startIcon={<AddRounded />} onClick={addParameter}>Add parameter</Button> : null}
            </Stack>
        </Box>
    );
}
