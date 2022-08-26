import Stack from '@mui/material/Stack';
import FunctionField from './FunctionField';

export default function FunctionsSection(props) {
    return (
        <Stack {...props} direction="column">
            <FunctionField functionName="x" />
            <FunctionField functionName="y" />
            <FunctionField functionName="z" />
        </Stack>
    );
}
