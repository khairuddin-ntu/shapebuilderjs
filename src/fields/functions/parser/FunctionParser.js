import { SnackbarError } from "../../../common/SnackbarMessage";

const DECIMAL_REGEX = /\d+\.\d+/g;

export default function parseFunctionInput(parameters, strInput) {
    console.log("parseFunctionInput: Input = " + strInput);

    // Get all decimals
    const decimals = [...strInput.matchAll(DECIMAL_REGEX)];
    console.log(decimals);

    return [null, new SnackbarError("Parse input not completed")]
};
