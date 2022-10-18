export default class Parameter {
    name;
    start = 0;
    end = 1;
    resolution = 50;

    constructor(paramName, resolution = 100) {
        this.name = paramName;
        this.resolution = resolution;
    }

    get range() {
        return this.end - this.start;
    }
    
    clone() {
        return new Parameter(this.name, this.resolution);
    }
}
