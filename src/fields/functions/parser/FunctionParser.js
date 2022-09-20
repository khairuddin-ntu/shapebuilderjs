import { SnackbarError } from "../../../common/SnackbarMessage";
import { isEmptyOrBlank } from "../../../common/StringUtils";

const NUMBER_REGEX = /\d+(\.\d+)?/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    // Get all numbers
    const numbers = [];
    const remainingChars = strInput.replace(NUMBER_REGEX, (match, _p1, offset) => {
        numbers.push({ input: match, index: offset });
        return "";
    });

    console.log(numbers);

    // Get remaining characters after parsing
    console.log("parseFunctionInput: Remaining characters = " + remainingChars);

    if (!isEmptyOrBlank(remainingChars)) {
        return [null, new SnackbarError("Invalid input: " + remainingChars[0])];
    }

    return [null, new SnackbarError("Parse input not completed")];
};
