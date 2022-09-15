import { SnackbarError } from "../../../common/SnackbarMessage";

export default function parseFunctionInput(parameters, strInput) {
    const inputChars = strInput.split("");
    return [null, new SnackbarError("Parse input not completed")]
};
