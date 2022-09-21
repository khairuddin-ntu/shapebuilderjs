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
    if (!Array.isArray(tokens)) {
        return [null, tokens];
    }

    return [null, new SnackbarError("Parse input not completed")];
};

function getTokens(parameters, strInput) {
    const tokens = [];

    const getLeafNode = (match, offset) => {
        tokens.push(new Token(match, offset));
        return " ".repeat(match.length);
    };

    // Get all numbers
    let remainingChars = strInput.replace(
        NUMBER_REGEX,
        (match, _p1, offset) => getLeafNode(match, offset)
    );

    // Get all instances of pi
    remainingChars = remainingChars.replace(PI_REGEX, getLeafNode);

    // Get all basic mathematical operations
    remainingChars = remainingChars.replace(MATH_OPERATOR_REGEX, getLeafNode);

    // Get all instances of params
    for (const paramRegex of parameters.map((param) => new RegExp(param.name))) {
        remainingChars = remainingChars.replace(paramRegex, getLeafNode);
    }

    // Get remaining characters after parsing
    remainingChars = remainingChars.trim();
    console.log("parseFunctionInput: Remaining characters = " + remainingChars);
    return isEmptyOrBlank(remainingChars)
        ? tokens.sort((a, b) => a.index - b.index)
        : new SnackbarError("Invalid input: " + remainingChars[0]);
}
