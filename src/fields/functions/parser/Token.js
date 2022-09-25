class Token {
    input;
    index;

    constructor(input, index) {
        this.input = input;
        this.index = index;
    }
}

export class ValueToken extends Token { }

export class ArithmeticToken extends Token { }

export class NegationToken extends ArithmeticToken {
    constructor(index) {
        super("-", index);
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
