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

function getAllParenthesis(strInput) {
    const wrappers = [];

    let parenCount;
    let startChar, endChar;
    for (let i = 0; i < strInput.length; i++) {
        startChar = strInput[i];

        // Return error if character is a closing bracket
        // Must find opening bracket before finding closing bracket
        if (startChar === ")") {
            return SnackbarError("Extra closing bracket at index " + i);
        }

        // Go to next position if character is not an opening bracket
        if (startChar !== "(") continue;

        // Return error if last 2 characters are opening brackets
        // Must have at least 1 character & 1 closing bracket after opening bracket
        if (i >= strInput.length - 2) {
            return SnackbarError("Missing closing bracket for index " + i);
        }

        parenCount = 0;
        for (let j = i + 1; j < strInput.length; j++) {
            endChar = strInput[j];

            // Go to next position if character is not a closing round bracket
            if (endChar !== ")") {
                // Return error if it's the last character
                // Closing bracket for given opening bracket not found
                if (j === strInput.length - 1) {
                    return SnackbarError("Missing closing bracket for index " + i);
                }

                // Increment parenthesis counter if there are inner parenthesis
                if (endChar === "(") parenCount++;
                continue;
            }

            // Decrement parenthesis counter & go to next position
            // if closing bracket belongs to inner parenthesis
            if (parenCount > 0) {
                // Return error if last character is a closing bracket
                // but does not belong to given opening bracket
                if (j === strInput.length - 1) {
                    return SnackbarError("Missing closing bracket for index " + i);
                }

                parenCount--;
                continue;
            }

            // Bracket pair found
            wrappers.push(new WrapperToken(strInput.substring(i, j + 1), i));
            i += j - i;
            break;
        }
    }

    return wrappers;
}
