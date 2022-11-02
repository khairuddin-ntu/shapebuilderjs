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

    asObject() {
        return {
            name: this.name, start: this.start, end: this.end, resolution: this.resolution,
            get range() { return this.end - this.start }
        }
    }
}
