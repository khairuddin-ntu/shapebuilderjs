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

    addChildTokens(tokens) {
        this.childTokens.push(...tokens);
    }
}
