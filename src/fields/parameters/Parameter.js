export default class Parameter {
    name;
    start = 0;
    end = 1;

    constructor(paramName) {
        this.name = paramName;
    }

    get range() {
        return this.end - this.start;
    }
}
