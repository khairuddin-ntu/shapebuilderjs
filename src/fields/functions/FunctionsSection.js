import Stack from '@mui/material/Stack';
import FunctionField from './FunctionField';
import { FUNCTION_NAMES } from './../../common/Constants';

export default function FunctionsSection(props) {
    const inputs = props.functionsRef;

    return (
        <Stack
            id={props.id}
            className={props.className}
            direction="column"
            spacing={2}
        >
            {
                FUNCTION_NAMES.map((name, i) =>
                    <FunctionField
                        key={i}
                        index={i}
                        inputsRef={inputs}
                        functionName={name}
                    />
                )
            }
        </Stack>
    );
}
