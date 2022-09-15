import Stack from '@mui/material/Stack';
import FunctionField from './FunctionField';

export default function FunctionsSection(props) {
    const functionNames = ["x", "y", "z"];
    const inputs = props.functionsRef;

    return (
        <Stack
            id={props.id}
            className={props.className}
            direction="column"
            spacing={2}
        >
            {
                functionNames.map((name, i) =>
                    <FunctionField
                        key={i}
                        index={i}
                        inputsRef={inputs}
                        inputErrorsRef={props.functionErrorsRef}
                        functionName={name}
                    />
                )
            }
        </Stack>
    );
}
