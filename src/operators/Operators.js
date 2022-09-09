import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ValueOperator, ArithmeticOperator } from './../common/Operator';
import OperatorItem from './OperatorItem';

import './Operators.css';

const operatorList = [
    new ValueOperator("Real Number", null, null),
    new ValueOperator("pi", null, null),
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
    new ValueOperator("Parenthesis", null, null),
    new ValueOperator("Sine", null, null),
    new ValueOperator("Cosine", null, null),
    new ValueOperator("Tangent", null, null),
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
