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

export class ValueOperator extends Operator { }

export class ArithmeticOperator extends Operator { }
