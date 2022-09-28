import { PRECENDENCE_MUL_DIV, PRECENDENCE_ADD_SUB } from '../common/Constants';

class Token {
    input;
    index;

    constructor(input, index) {
        this.input = input;
        this.index = index;
    }
}

export class ValueToken extends Token {
    isNegated;

    constructor(input, index, isNegated = false) {
        super(input, index);
        this.isNegated = isNegated;
    }

    get nonNegatedInput() {
        return this.isNegated ? this.input.substring(1) : this.input;
    }
}

export class ParamToken extends ValueToken { }

export class FixedValueToken extends ValueToken {
    value;

    constructor(input, index) {
        super(input, index);

        if (input.endsWith("pi")) {
            this.value = Math.PI;
            if (this.isNegated) {
                this.value = -this.value;
            }
        } else {
            this.value = parseFloat(input);
        }
    }
}

export class WrapperToken extends ValueToken {
    childTokens = [];
    prefixLength;
    suffixLength = 1;

    constructor(input, index) {
        super(input, index);
        this.prefixLength = this.input.split("(")[0].length + 1;
    }

    get childInput() {
        return this.input.substring(this.prefixLength, this.input.length - this.suffixLength);
    }

    addChildTokens(tokens) {
        this.childTokens.push(...tokens);
    }

    processChildrenValue(value) {
        switch (this.input.substring(0, this.prefixLength - 1)) {
            case "sin":
                return Math.sin(value);
            case "cos":
                return Math.cos(value);
            case "tan":
                return Math.tan(value);
            default:
                return value;
        }
    }
}

export class ArithmeticToken extends Token {
    // Precendence values taken from Javascript documentation
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table
    precedence;

    constructor(input, index) {
        super(input, index);

        switch (input) {
            case "+":
            case "-":
                this.precedence = PRECENDENCE_ADD_SUB;
                break;
            default:
                this.precedence = PRECENDENCE_MUL_DIV;
                break;
        }
    }

    processArithmetic(prevValue, nextValue) {
        switch (this.input) {
            case "+":
                return prevValue + nextValue;
            case "-":
                return prevValue - nextValue;
            case "/":
                return prevValue / nextValue;
            default:
                return prevValue * nextValue;
        }
    }
}
