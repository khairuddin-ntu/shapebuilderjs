import { BLANK_REGEX } from "./Constants";

export const isEmptyOrBlank = (strInput) => BLANK_REGEX.test(strInput);