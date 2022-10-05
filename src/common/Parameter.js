export default class Parameter {
    name;
    start = 0;
    end = 1;
    resolution = 100;

    constructor(paramName, resolution = 100) {
        this.name = paramName;
        this.resolution = resolution;
    }

    get range() {
        return this.end - this.start;
    }
}
