import { SnackbarError } from "../../../common/SnackbarMessage";
import { isEmptyOrBlank } from "../../../common/StringUtils";

const DECIMAL_REGEX = /\d+\.\d+/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    // Get all decimals
    const decimals = [...strInput.matchAll(DECIMAL_REGEX)];
    console.log(decimals);

    // Get remaining characters after parsing
    const remainingChars = strInput.split(DECIMAL_REGEX);
    console.log(remainingChars);

    for (const chars of remainingChars) {
        if (!chars || isEmptyOrBlank(chars)) continue;
        return [null, new SnackbarError("Invalid input: " + chars)];
    }

    return [null, new SnackbarError("Parse input not completed")];
};
