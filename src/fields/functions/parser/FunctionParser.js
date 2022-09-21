import Token, { WrapperToken } from './Token';
import { SnackbarError } from "../../../common/SnackbarMessage";
import { isEmptyOrBlank } from "../../../common/StringUtils";

const TRIGO_REGEX = /(sin|cos|tan)\(.+\)/g;
const PAREN_REGEX = /\(.+\)/g;
const NUMBER_REGEX = /\d+(\.\d+)?/g;
const PI_REGEX = /pi/g;
const MATH_OPERATOR_REGEX = /[+\-*/]/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    let [tokens, remainingChars] = getTokens(parameters, strInput);
    console.log(tokens);
    console.log("parseFunctionInput: Remaining characters = \"" + remainingChars + "\"");
    remainingChars = remainingChars.trim();
    if (!isEmptyOrBlank(remainingChars)) {
        return [null, new SnackbarError("Invalid input: " + remainingChars[0])];
    }

    return [null, new SnackbarError("Parse input not completed")];
};

function getTokens(parameters, strInput) {
    const tokens = [];

    const getLeafNode = (match, offset) => {
        tokens.push(new Token(match, offset));
        return " ".repeat(match.length);
    };

    const getParentNode = (match, offset) => {
        const parentToken = new WrapperToken(match, offset);
        const [childTokens, remainingChars] = getTokens(parameters, parentToken.childInput);
        parentToken.addChildTokens(childTokens);

        tokens.push(parentToken);
        return " ".repeat(parentToken.prefixLength) + remainingChars + " ".repeat(parentToken.suffixLength);
    };

    // Get all trigonometric functions
    let remainingChars = strInput.replace(
        TRIGO_REGEX, (match, _p1, offset) => getParentNode(match, offset)
    );

    // Get all parenthesis
    remainingChars = remainingChars.replace(PAREN_REGEX, getParentNode);

    // Get all numbers
    remainingChars = remainingChars.replace(
        NUMBER_REGEX, (match, _p1, offset) => getLeafNode(match, offset)
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
    return [tokens.sort((a, b) => a.index - b.index), remainingChars];
}

function getParenthesis(strInput) {
    const stringParts = [];
    let parenCount;
    let endChar;
    for (let i = 0; i < strInput.length; i++) {
        if (strInput[i] !== "(") {
            return SnackbarError("Extra closing bracket at index " + i);
        }

        if (strInput[i] !== "(") continue;

        parenCount = 0;
        for (let j = i + 1; j < strInput.length; j++) {
            endChar = strInput[j];
            // Return error if this is the last character & it's not a closing bracket
            if (j === strInput.length - 1 && endChar !== ")") {
                return SnackbarError("Missing closing bracket for index " + i);
            }

            // Check if there are inner parenthesis
            if (endChar === "(") {
                parenCount++;
                continue;
            }

            // Check if character is closing round bracket
            if (endChar !== ")") continue;

            // Check if closing round bracket belongs to an inner parenthesis
            if (parenCount > 0) {
                parenCount--;
                continue;
            }

            stringParts.push(strInput.substring(i, j + 1));
            i += j - i;
            break;
        }
    }
}
