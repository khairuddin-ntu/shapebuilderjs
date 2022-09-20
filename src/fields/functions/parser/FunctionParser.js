import { SnackbarError } from "../../../common/SnackbarMessage";
import { isEmptyOrBlank } from "../../../common/StringUtils";

const NUMBER_REGEX = /\d+(\.\d+)?/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    // Get all numbers
    const numbers = [...strInput.matchAll(NUMBER_REGEX)];
    console.log(numbers);

    // Get remaining characters after parsing
    const remainingChars = strInput.split(NUMBER_REGEX);
    console.log(remainingChars);

    for (const chars of remainingChars) {
        if (!chars || isEmptyOrBlank(chars)) continue;
        return [null, new SnackbarError("Invalid input: " + chars)];
    }

    return [null, new SnackbarError("Parse input not completed")];
};
