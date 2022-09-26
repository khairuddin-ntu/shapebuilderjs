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
}

export class ArithmeticToken extends Token { }
