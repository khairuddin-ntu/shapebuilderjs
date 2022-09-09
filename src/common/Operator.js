import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';

class Operator {
    name;
    generateUi;
    operation;

    constructor(name, generateUi, operation) {
        if (this.constructor === Operator) {
            throw new Error("Abstract class cannot be instantiated");
        }

        this.name = name;
        this.generateUi = generateUi ? generateUi : () => <QuestionMarkRoundedIcon />;
        this.operation = operation;
    }
}

class ValueOperator extends Operator { }

class ArithmeticOperator extends Operator { }

export const operatorList = [
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
