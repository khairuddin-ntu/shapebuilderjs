import Stack from '@mui/material/Stack';
import FunctionField from './FunctionField';

export default function FunctionsSection(props) {
    return (
        <Stack
            {...props}
            direction="column"
            spacing={2}
        >
            <FunctionField functionName="x" />
            <FunctionField functionName="y" />
            <FunctionField functionName="z" />
        </Stack>
    );
}
