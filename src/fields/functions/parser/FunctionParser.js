import Token, { WrapperToken } from './Token';
import { SnackbarError } from "../../../common/SnackbarMessage";
import { isEmptyOrBlank } from "../../../common/StringUtils";

const TRIGO_REGEX = /(sin|cos|tan)/;
const NUMBER_REGEX = /\d+(\.\d+)?/g;
const PI_REGEX = /pi/g;
const MATH_OPERATOR_REGEX = /[+\-*/]/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    let [tokens, tokenError] = getTokens(parameters, strInput);
    console.log(tokens);
    if (tokenError) {
        return [null, tokenError];
    }

    return [null, new SnackbarError("Parse input not completed")];
};

function getTokens(parameters, strInput) {
    const tokens = [];
    let remainingChars = strInput;

    const getLeafNode = (match, offset) => {
        tokens.push(new Token(match, offset));
        return " ".repeat(match.length);
    };

    // Get all trigonometric & parenthesis functions
    const [parentTokens, parentTokenError] = getAllParentTokens(remainingChars);
    if (parentTokenError) {
        return [tokens, parentTokenError];
    }

    let endIndex;
    for (const parentToken of parentTokens) {
        const [childTokens, childTokenError] = getTokens(parameters, parentToken.childInput);
        if (childTokenError) {
            return [tokens, childTokenError];
        }

        parentToken.addChildTokens(childTokens);
        tokens.push(parentToken);
        endIndex = parentToken.index + parentToken.input.length;
        remainingChars = remainingChars.substring(0, parentToken.index) + " ".repeat(parentToken.input.length) + remainingChars.substring(endIndex);
    }

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

    console.log("parseFunctionInput: Remaining characters = \"" + remainingChars + "\"");
    remainingChars = remainingChars.trim()
    if (!isEmptyOrBlank(remainingChars)) {
        return [tokens, new SnackbarError("Invalid input: " + remainingChars[0])];
    }

    // Get remaining characters after parsing
    return [tokens.sort((a, b) => a.index - b.index), remainingChars];
}

function getAllParentTokens(strInput) {
    const parentTokens = [];

    let parenCount;
    let startChar, endChar;
    let isTrigo;
    let startIndex;
    for (let i = 0; i < strInput.length; i++) {
        startChar = strInput[i];

        // Return error if character is a closing bracket
        // Must find opening bracket before finding closing bracket
        if (startChar === ")") {
            return [parentTokens, new SnackbarError("Extra closing bracket at index " + i)];
        }

        // Go to next position if character is not an opening bracket
        if (startChar !== "(") continue;

        // Return error if last 2 characters are opening brackets
        // Must have at least 1 character & 1 closing bracket after opening bracket
        if (i >= strInput.length - 2) {
            return [parentTokens, new SnackbarError("Missing closing bracket for index " + i)];
        }

        parenCount = 0;
        for (let j = i + 1; j < strInput.length; j++) {
            endChar = strInput[j];

            // Go to next position if character is not a closing round bracket
            if (endChar !== ")") {
                // Return error if it's the last character
                // Closing bracket for given opening bracket not found
                if (j === strInput.length - 1) {
                    return [parentTokens, new SnackbarError("Missing closing bracket for index " + i)];
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
                    return [parentTokens, new SnackbarError("Missing closing bracket for index " + i)];
                }

                parenCount--;
                continue;
            }

            // Bracket pair found
            // Check if previous 3 characters represent a trigonometric function
            isTrigo = (i >= 3 && TRIGO_REGEX.test(strInput.substring(i - 3, i)));
            // Change start index based on whether it's a trigonometric function
            startIndex = i - (isTrigo ? 3 : 0);
            parentTokens.push(new WrapperToken(strInput.substring(startIndex, j + 1), startIndex));
            i += j - i;
            break;
        }
    }

    return [parentTokens, null];
}
