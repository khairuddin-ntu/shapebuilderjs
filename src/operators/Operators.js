import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ValueOperator, ArithmeticOperator } from './../common/Operator';

import './Operators.css';

const operatorList = [
    ArithmeticOperator("Addition", null, null),
    ArithmeticOperator("Subtraction", null, null),
    ArithmeticOperator("Multiplication", null, null),
    ArithmeticOperator("Division", null, null),
    ValueOperator("Real Number", null, null),
    ValueOperator("pi", null, null),
    ValueOperator("Parenthesis", null, null),
    ValueOperator("Sine", null, null),
    ValueOperator("Cosine", null, null),
    ValueOperator("Tangent", null, null),
    ValueOperator("Fraction", null, null),
    ValueOperator("Power", null, null)
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

        </Grid>
    );
}
