import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FunctionField from './FunctionField';
import { FUNCTION_NAMES } from '../../common/Constants';

export default function FunctionsSection(props) {
    const functions = props.functions;

    const setFunction = (i, funcInput) => {
        const newFunctions = [...functions];
        newFunctions[i] = funcInput;
        props.setFunctions(newFunctions);
    };

    return (
        <Box id={props.id}>
            <Typography variant="h6">Functions</Typography>
            <Stack
                className={props.className}
                direction="column"
                spacing={2}
            >
                {
                    functions.map((funcInput, i) =>
                        <FunctionField
                            key={i}
                            functionName={FUNCTION_NAMES[i]}
                            funcInput={funcInput}
                            setFunction={(funcInput) => setFunction(i, funcInput)}
                        />
                    )
                }
            </Stack>
        </Box>
    );
}
