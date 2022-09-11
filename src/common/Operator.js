import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

class Operator {
    name;
    generateUi;
    operation;

    constructor(name, generateUi, operation) {
        if (this.constructor === Operator) {
            throw new Error("Abstract class cannot be instantiated");
        }

        this.name = name;
        this.generateUi = generateUi ? generateUi : () => <Typography variant="h4">?</Typography>;
        this.operation = operation;
    }
}

export class ValueOperator extends Operator { }

export class ArithmeticOperator extends Operator {
    constructor(name, symbol, operation) {
        super(
            name,
            () => <Typography variant="h4">{symbol}</Typography>,
            operation
        );
    }
}

export class FunctionOperator extends ValueOperator {
    constructor(name, functionName, operation) {
        super(
            name,
            () => (
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                >
                    <Typography variant="h5">{functionName}(</Typography>
                    {/* TODO: Resize text field whenever user input changes*/}
                    <TextField
                        disabled
                        size="small"
                        variant="outlined"
                        type="text"
                        inputProps={{ size: 1 }}
                    />
                    <Typography variant="h5">)</Typography>
                </Stack>
            ),
            operation
        );
    }
}
