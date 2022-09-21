import { SnackbarError } from "../../../common/SnackbarMessage";
import { isEmptyOrBlank } from "../../../common/StringUtils";

const NUMBER_REGEX = /\d+(\.\d+)?/g;
const PI_REGEX = /pi/g;
const MATH_OPERATOR_REGEX = /[+\-*/]/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    // Get all numbers
    const numbers = [];
    let remainingChars = strInput.replace(NUMBER_REGEX, (match, _p1, offset) => {
        numbers.push({ input: match, index: offset });
        return " ".repeat(match.length);
    });

    console.log(numbers);

    // Get all instances of pi
    const pis = [];
    remainingChars = remainingChars.replace(PI_REGEX, (match, offset) => {
        pis.push({ input: match, index: offset });
        return " ".repeat(match.length);
    });

    console.log(pis);

    // Get all basic mathematical operations
    const operators = [];
    remainingChars = remainingChars.replace(MATH_OPERATOR_REGEX, (match, offset) => {
        operators.push({input: match, index: offset});
        return " ".repeat(match.length);
    });

    console.log(operators);

    // Get remaining characters after parsing
    remainingChars = remainingChars.trim();
    console.log("parseFunctionInput: Remaining characters = " + remainingChars);
    if (!isEmptyOrBlank(remainingChars)) {
        return [null, new SnackbarError("Invalid input: " + remainingChars[0])];
    }

    return [null, new SnackbarError("Parse input not completed")];
};
