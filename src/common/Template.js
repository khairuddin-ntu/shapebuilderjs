export default class Template {
    #name;
    #imageFileName;
    #functionInputs;
    #parameters;

    constructor(name, imageFileName, functionInputs, parameters) {
        this.#name = name;
        this.#imageFileName = imageFileName;
        this.#functionInputs = functionInputs;
        this.#parameters = parameters;
    }

    get name() {
        return this.#name;
    }

    get imageFileName() {
        return this.#imageFileName;
    }

    get functionInputs() {
        return this.#functionInputs;
    }

    get parameters() {
        return this.#parameters;
    }
}