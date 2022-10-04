import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { FixedValueOperator, ArithmeticOperator, FunctionOperator, WrapperOperator } from '../common/Operator';
import OperatorItem from './OperatorItem';

import './Templates.css';

const operatorList = [
    new FixedValueOperator(
        "Exponent",
        () => <Typography className="exponent" variant="h4">e</Typography>,
        Math.E
    ),
    new FixedValueOperator(
        "pi",
        () => <Typography variant="h4">π</Typography>,
        Math.PI
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
    new WrapperOperator(
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
    new WrapperOperator(
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

export default function Templates(props) {
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
