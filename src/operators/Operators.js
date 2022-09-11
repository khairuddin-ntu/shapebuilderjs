import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ValueOperator, ArithmeticOperator, FunctionOperator } from './../common/Operator';
import OperatorItem from './OperatorItem';

import './Operators.css';

const operatorList = [
    new ValueOperator(
        "Real Number",
        () => (
            // TODO: Resize text field whenever user input changes
            <TextField
                disabled
                size="small"
                variant="outlined"
                type="text"
                inputProps={{ size: 1 }}
            />
        ),
        null
    ),
    new ValueOperator(
        "pi", () => <Typography variant="h4">π</Typography>,
        null
    ),
    new ArithmeticOperator(
        "Addition", "+",
        (prev, next) => prev + next
    ),
    new ArithmeticOperator(
        "Subtraction", "-",
        (prev, next) => prev - next
    ),
    new ArithmeticOperator(
        "Multiplication", "×",
        (prev, next) => prev * next
    ),
    new ArithmeticOperator(
        "Division", "÷",
        (prev, next) => prev / next
    ),
    new FunctionOperator(
        "Parenthesis", null,
        null
    ),
    new FunctionOperator(
        "Sine", "sin",
        null
    ),
    new FunctionOperator(
        "Cosine", "cos",
        null
    ),
    new FunctionOperator(
        "Tangent", "tan",
        null
    ),
    new ValueOperator(
        "Fraction",
        () => (
            <Stack
                alignItems="center"
                spacing={0.7}
            >
                <TextField
                    disabled
                    size="small"
                    inputProps={{ size: 1 }}
                />
                <hr id="fraction-divider" />
                <TextField
                    disabled
                    size="small"
                    inputProps={{ size: 1 }}
                />
            </Stack>
        ),
        null
    ),
    new ValueOperator(
        "Power",
        () => (
            <Stack
                direction="row"
                spacing={0.5}
            >
                <Box mt={2}>
                    <TextField
                        disabled
                        size="small"
                        inputProps={{ size: 1 }}
                    />
                </Box>
                <TextField
                    disabled
                    size="small"
                    inputProps={{ size: 1 }}
                />
            </Stack>
        ),
        null
    )
];

export default function Operators(props) {
    return (
        <Grid
            container
            columns={2}
            id={props.id}
            sx={{ borderLeft: 1 }}
        >
            <Grid
                item
                xs={2}
            >
                <Typography variant="h4">Operators</Typography>
            </Grid>
            {operatorList.map((operator, i) => (
                <Grid
                    item
                    key={i}
                    xs={1}
                >
                    <OperatorItem
                        operator={operator}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
