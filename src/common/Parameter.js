export default class Parameter {
    name;
    start = 0;
    end = 1;
    resolution = 100;

    constructor(paramName) {
        this.name = paramName;
    }

    get range() {
        return this.end - this.start;
    }
}
