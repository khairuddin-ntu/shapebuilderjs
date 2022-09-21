import Token, { FuncToken, WrapperToken } from './Token';
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

    const getParentNode = (parentToken) => {
        const [childTokens, remainingChars] = getTokens(parameters, parentToken.childInput);
        parentToken.addChildTokens(childTokens);

        tokens.push(parentToken);
        return "    " + remainingChars + " ";
    };

    // Get all trigonometric functions
    let remainingChars = strInput.replace(
        TRIGO_REGEX,
        (match, _p1, offset) => getParentNode(new FuncToken(match, offset))
    );

    // Get all parenthesis
    remainingChars = remainingChars.replace(
        PAREN_REGEX,
        (match, offset) => getParentNode(new WrapperToken(match, offset))
    );

    // Get all numbers
    remainingChars = remainingChars.replace(
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
    return [tokens.sort((a, b) => a.index - b.index), remainingChars];
}
