import Token from './Token';
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

function retrieveToken(arr, match, offset) {
    arr.push(new Token(match, offset));
    return " ".repeat(match.length);
}

function getTokens(parameters, strInput) {
    // Get all numbers
    const numbers = [];
    let remainingChars = strInput.replace(
        NUMBER_REGEX,
        (match, _p1, offset) => retrieveToken(numbers, match, offset)
    );

    // Get all instances of pi
    const pis = [];
    remainingChars = remainingChars.replace(
        PI_REGEX,
        (match, offset) => retrieveToken(pis, match, offset)
    );

    // Get all basic mathematical operations
    const operators = [];
    remainingChars = remainingChars.replace(
        MATH_OPERATOR_REGEX,
        (match, offset) => retrieveToken(operators, match, offset)
    );

    // Get all instances of params
    const params = [];
    for (const paramRegex of parameters.map((param) => new RegExp(param.name))) {
        remainingChars = remainingChars.replace(
            paramRegex,
            (match, offset) => retrieveToken(params, match, offset)
        );
    }

    // Get remaining characters after parsing
    remainingChars = remainingChars.trim();
    console.log("parseFunctionInput: Remaining characters = " + remainingChars);
    return isEmptyOrBlank(remainingChars)
        ? [numbers, pis, operators, params]
        : [new SnackbarError("Invalid input: " + remainingChars[0])];
}
