import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FunctionField from './FunctionField';
import { DEFAULT_FUNCTIONS, FUNCTION_NAMES } from '../../common/Constants';

export default function FunctionsSection(props) {
    const inputs = props.functionsRef;

    return (
        <Box id={props.id}>
            <Typography variant="h6">Functions</Typography>
            <Stack
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
                            defaultValue={DEFAULT_FUNCTIONS[i]}
                        />
                    )
                }
            </Stack>
        </Box>
    );
}
