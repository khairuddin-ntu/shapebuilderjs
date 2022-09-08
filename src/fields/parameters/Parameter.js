export default class Parameter {
    name;
    min = 0;
    max = 1;

    constructor(paramName) {
        this.name = paramName;
    }
}
