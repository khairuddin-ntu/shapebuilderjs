import { PRECENDENCE_MUL_DIV, PRECENDENCE_ADD_SUB } from './Constants';

class Token {
    input;
    index;

    constructor(input, index) {
        this.input = input;
        this.index = index;
    }
}

export class ValueToken extends Token {
    isNegated = false;

    get nonNegatedInput() {
        return this.isNegated ? this.input.substring(1) : this.input;
    }
}

export class ParamToken extends ValueToken { }

export class FixedValueToken extends ValueToken {
    #absoluteValue;

    constructor(input, index) {
        super(input, index);

        if (input.endsWith("pi")) {
            this.#absoluteValue = Math.PI;
            if (this.isNegated) {
                this.#absoluteValue = -this.#absoluteValue;
            }
        } else {
            this.#absoluteValue = parseFloat(input);
        }
    }

    get value() {
        return this.#absoluteValue * (this.isNegated ? -1 : 1);
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
        const negationValue = this.isNegated ? -1 : 1;
        switch (this.input.substring(0, this.prefixLength - 1)) {
            case "sin":
                return Math.sin(value) * negationValue;
            case "cos":
                return Math.cos(value) * negationValue;
            case "tan":
                return Math.tan(value) * negationValue;
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
