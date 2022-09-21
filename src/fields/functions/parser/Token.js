export default class Token {
    input;
    index;

    constructor(input, index) {
        this.input = input;
        this.index = index;
    }
}

export class WrapperToken extends Token {
    childTokens = [];

    get childInput() {
        return this.input.substring(1, this.input.length - 1);
    }

    addChildTokens(tokens) {
        this.childTokens.push(...tokens);
    }
}

export class FuncToken extends WrapperToken {
    get childInput() {
        return this.input.substring(4, this.input.length - 1);
    }
}
