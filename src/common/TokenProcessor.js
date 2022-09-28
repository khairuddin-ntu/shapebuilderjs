import { FixedValueToken, ParamToken, WrapperToken } from './Token';

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
}
