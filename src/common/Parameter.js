export default class Parameter {
    name;
    start = 0;
    end = 1;
    resolution;

    constructor(paramName, resolution = 50) {
        this.name = paramName;
        this.resolution = resolution;
    }

    get range() {
        return this.end - this.start;
    }
}
