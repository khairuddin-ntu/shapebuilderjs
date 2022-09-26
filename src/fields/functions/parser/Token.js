class Token {
    input;
    index;

    constructor(input, index) {
        this.input = input;
        this.index = index;
    }
}

export class ValueToken extends Token { }

export class ParamToken extends ValueToken { }

export class FixedValueToken extends ValueToken {
    value;

    constructor(input, index) {
        super(input, index);

        if (input === "pi") {
            this.value = Math.PI;
        } else if (input === "-pi") {
            this.value = -Math.PI;
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

export class NegationToken extends ArithmeticToken {
    constructor(index) {
        super("-", index);
    }
}
