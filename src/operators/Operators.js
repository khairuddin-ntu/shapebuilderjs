import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
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
        null
    ),
    new ArithmeticOperator(
        "Subtraction", "-",
        null
    ),
    new ArithmeticOperator(
        "Multiplication", "×",
        null),
    new ArithmeticOperator(
        "Division", "÷",
        null
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
    new ValueOperator("Fraction", null, null),
    new ValueOperator("Power", null, null)
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
