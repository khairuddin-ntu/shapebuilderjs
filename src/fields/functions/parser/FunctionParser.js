import { ArithmeticToken, FixedValueToken, ParamToken, ValueToken, WrapperToken } from '../../../common/Token';
import { isEmptyOrBlank } from "../../../common/StringUtils";

const TRIGO_REGEX = /(sin|cos|tan)/;
const NUMBER_REGEX = /\d+(\.\d+)?/g;
const PI_REGEX = /pi/g;
const MATH_OPERATOR_REGEX = /[+\-*/]/g;
const WHITESPACE_REGEX = /\s+/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    let [tokens, tokenError] = getTokens(parameters, strInput);
    if (tokenError) return [null, tokenError];

    let validationError = validateGrammar(tokens);
    console.log(tokens);
    if (validationError) return [null, validationError];

    return [null, "Parse input not completed"];
};

function getTokens(parameters, strInput) {
    const tokens = [];
    let remainingChars = strInput;

    const getFixedValueToken = (match, offset) => {
        tokens.push(new FixedValueToken(match, offset));
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
        NUMBER_REGEX, (match, _p1, offset) => getFixedValueToken(match, offset)
    );

    // Get all instances of pi
    remainingChars = remainingChars.replace(PI_REGEX, getFixedValueToken);

    // Get all basic mathematical operations
    remainingChars = remainingChars.replace(MATH_OPERATOR_REGEX, (match, offset) => {
        tokens.push(new ArithmeticToken(match, offset));
        return " ".repeat(match.length);
    });

    // Get all instances of params
    for (const paramRegex of parameters.map((param) => new RegExp(param.name))) {
        remainingChars = remainingChars.replace(paramRegex, (match, offset) => {
            tokens.push(new ParamToken(match, offset));
            return " ".repeat(match.length);
        });
    }

    console.log("parseFunctionInput: Remaining characters = \"" + remainingChars + "\"");
    remainingChars = remainingChars.trim()
    if (!isEmptyOrBlank(remainingChars)) {
        return [tokens, "Invalid input: " + remainingChars.split(WHITESPACE_REGEX)[0]];
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
            return [parentTokens, "Extra closing bracket at index " + i];
        }

        // Go to next position if character is not an opening bracket
        if (startChar !== "(") continue;

        // Return error if last 2 characters are opening brackets
        // Must have at least 1 character & 1 closing bracket after opening bracket
        if (i >= strInput.length - 2) {
            return [parentTokens, "Missing closing bracket for index " + i];
        }

        parenCount = 0;
        for (let j = i + 1; j < strInput.length; j++) {
            endChar = strInput[j];

            // Go to next position if character is not a closing round bracket
            if (endChar !== ")") {
                // Return error if it's the last character
                // Closing bracket for given opening bracket not found
                if (j === strInput.length - 1) {
                    return [parentTokens, "Missing closing bracket for index " + i];
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
                    return [parentTokens, "Missing closing bracket for index " + i];
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

function validateGrammar(tokens) {
    let prevToken, token, nextToken;
    let childError;
    let max = tokens.length;
    for (let i = 0; i < max; i++) {
        token = tokens[i];
        if (token instanceof WrapperToken) {
            childError = validateGrammar(token.childTokens);
            if (childError) return childError;
            continue;
        }

        prevToken = i > 0 ? tokens[i - 1] : null;
        nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;

        if (token instanceof ArithmeticToken) {
            // Check if token is the first character
            if (i === 0) {
                // Return error if first token is an arithmetic operator that is not a "-"
                if (token.input !== "-") {
                    return "Missing prefix value for operator \"" + token.input + "\"";
                }

                // Return error if next token is not a value
                if (!(nextToken instanceof ValueToken)) {
                    return "Missing prefix value for operator \"" + token.input + "\"";
                }

                // Negate value token
                nextToken.isNegated = true;
                tokens.splice(i, 1);
                max -= 1;
                continue;
            }

            // Return error if token is the last token
            if (i === tokens.length - 1) {
                return "Missing suffix value for operator \"" + token.input + "\"";
            }

            // Replace with negation token if between arithmetic & value token
            if (token.input === "-"
                && prevToken instanceof ArithmeticToken
                && nextToken instanceof ValueToken) {
                nextToken.isNegated = true;
                tokens.splice(i, 1);
                max -= 1;
                continue;
            }

            // Return error if previous token is not a value
            if (!(prevToken instanceof ValueToken)) {
                return "Invalid token before \"" + token.input + "\"";
            }

            // Return error if next token is not a value
            if (!(nextToken instanceof ValueToken)) {
                // Continue if next token is "-". May be a negation token
                if (nextToken instanceof ArithmeticToken && nextToken.input === "-") {
                    continue;
                }

                return "Invalid token after \"" + token.input + "\"";
            }
        }
    }
}
