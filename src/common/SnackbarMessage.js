class SnackbarMessage {
    type;
    message;

    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}

export class SnackbarError extends SnackbarMessage {
    constructor(message) {
        super("error", message);
    }
}

export class SnackbarSuccess extends SnackbarMessage {
    constructor(message) {
        super("success", message);
    }
}
