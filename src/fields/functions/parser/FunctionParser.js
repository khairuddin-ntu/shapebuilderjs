import { SnackbarError } from "../../../common/SnackbarMessage";
import { isEmptyOrBlank } from "../../../common/StringUtils";

const NUMBER_REGEX = /\d+(\.\d+)?/g;
const PI_REGEX = /pi/g;
const MATH_OPERATOR_REGEX = /[+\-*/]/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    const tokens = getTokens(parameters, strInput);
    console.log(tokens);
    if (tokens.length === 1) {
        return [null, tokens[0]];
    }

    return [null, new SnackbarError("Parse input not completed")];
};

function getTokens(parameters, strInput) {
    // Get all numbers
    const numbers = [];
    let remainingChars = strInput.replace(NUMBER_REGEX, (match, _p1, offset) => {
        numbers.push({ input: match, index: offset });
        return " ".repeat(match.length);
    });

    // Get all instances of pi
    const pis = [];
    remainingChars = remainingChars.replace(PI_REGEX, (match, offset) => {
        pis.push({ input: match, index: offset });
        return " ".repeat(match.length);
    });

    // Get all basic mathematical operations
    const operators = [];
    remainingChars = remainingChars.replace(MATH_OPERATOR_REGEX, (match, offset) => {
        operators.push({ input: match, index: offset });
        return " ".repeat(match.length);
    });

    // Get all instances of params
    const params = [];
    const paramRegexs = parameters.map((param) => new RegExp(param.name));
    for (const paramRegex of paramRegexs) {
        remainingChars = remainingChars.replace(paramRegex, (match, offset) => {
            params.push({input: match, index: offset});
            return " ".repeat(match.length);
        })
    }

    // Get remaining characters after parsing
    remainingChars = remainingChars.trim();
    console.log("parseFunctionInput: Remaining characters = " + remainingChars);
    return isEmptyOrBlank(remainingChars)
        ? [numbers, pis, operators, params]
        : [new SnackbarError("Invalid input: " + remainingChars[0])];
}
