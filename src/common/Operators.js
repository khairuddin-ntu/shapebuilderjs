class Operator {
    name;
    ui;
    operation;
    
    constructor(name, ui, operation) {
        if (this.constructor == Operator) {
            throw new Error("Abstract class cannot be instantiated");
        }

        this.name = name;
        this.ui = ui;
        this.operation = operation;
    }
}
