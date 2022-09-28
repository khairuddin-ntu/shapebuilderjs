import { PRECENDENCE_ADD_SUB, PRECENDENCE_MUL_DIV } from './Constants';
import { ArithmeticToken, FixedValueToken, ParamToken, WrapperToken } from './Token';

// Order of precedence:
// 1) Parenthesis, trigonometric function
// 2) Multiplication, Division
// 3) Addition, subtraction
export function calculateValue(tokens, parameters) {
    // Convert value tokens to numeric values
    let param;
    tokens.map((token) => {
        if (token instanceof WrapperToken) {
            return token.processChildrenValue(calculateValue(token.childInput, parameters));
        }

        if (token instanceof FixedValueToken) {
            return token.value;
        }

        if (token instanceof ParamToken) {
            param = parameters.find((parameter) => parameter.name === token.input);
            if (param) {
                return param.value;
            }
        }

        return token;
    });

    let token;
    let i, max = tokens.length;
    // Process multiplications & divisions
    for (i = 0; i < max; i++) {
        token = tokens[i];

        if (!(token instanceof ArithmeticToken && token.precedence === PRECENDENCE_MUL_DIV)) {
            continue;
        }

        tokens[i - 1] = token.processArithmetic(tokens[i - 1], tokens[i + 1]);
        tokens.splice(i, 2);
        max -= 2;
    }

    // Process additions & subtractions
    for (i = 0; i < max; i++) {
        token = tokens[i];

        if (!(token instanceof ArithmeticToken && token.precedence === PRECENDENCE_ADD_SUB)) {
            continue;
        }

        tokens[i - 1] = token.processArithmetic(tokens[i - 1], tokens[i + 1]);
        tokens.splice(i, 2);
        max -= 2;
    }

    return tokens[0];
}
