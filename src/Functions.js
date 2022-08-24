import Stack from '@mui/material/Stack';
import FunctionField from './FunctionField';

export default function Functions() {
    return (
        <Stack direction="column">
            <FunctionField functionName="x" />
            <FunctionField functionName="y" />
            <FunctionField functionName="z" />
        </Stack>
    );
}
