import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function OperatorItem(props) {
    const operator = props.operator;

    return (
        <Stack
            alignItems="center"
            spacing={2}
        >
            {operator.generateUi()}
            <Typography>{operator.name}</Typography>
        </Stack>
    );
}
