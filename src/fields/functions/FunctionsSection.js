import Stack from '@mui/material/Stack';
import FunctionField from './FunctionField';

export default function FunctionsSection(props) {
    return (
        <Stack
            id={props.id}
            className={props.className}
            direction="column"
            spacing={2}
        >
            <FunctionField functionName="x" />
            <FunctionField functionName="y" />
            <FunctionField functionName="z" />
        </Stack>
    );
}
