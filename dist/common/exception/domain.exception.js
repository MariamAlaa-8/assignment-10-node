"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenExecution = exports.ForbiddenException = exports.UnauthorizedExecution = exports.UnauthorizedException = exports.NotfoundException = exports.ConflictException = exports.TooManyException = exports.BadException = void 0;
const main_exception_1 = require("./main.exception");
class BadException extends main_exception_1.ApplicationException {
    constructor(message = "BadRequest", cause) {
        super(message, 400, cause);
    }
}
exports.BadException = BadException;
class TooManyException extends main_exception_1.ApplicationException {
    constructor(message = "TooManyException", cause) {
        super(message, 429, cause);
    }
}
exports.TooManyException = TooManyException;
class ConflictException extends main_exception_1.ApplicationException {
    constructor(message = "conflict", cause) {
        super(message, 409, cause);
    }
}
exports.ConflictException = ConflictException;
class NotfoundException extends main_exception_1.ApplicationException {
    constructor(message = "Notfound", cause) {
        super(message, 404, cause);
    }
}
exports.NotfoundException = NotfoundException;
class UnauthorizedException extends main_exception_1.ApplicationException {
    constructor(message = "Unauthorized", cause) {
        super(message, 401, cause);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class UnauthorizedExecution extends UnauthorizedException {
    constructor(message = "Unauthorized", cause) {
        super(message, cause);
    }
}
exports.UnauthorizedExecution = UnauthorizedExecution;
class ForbiddenException extends main_exception_1.ApplicationException {
    constructor(message = "Forbidden", cause) {
        super(message, 403, cause);
    }
}
exports.ForbiddenException = ForbiddenException;
class ForbiddenExecution extends ForbiddenException {
    constructor(message = "Forbidden", cause) {
        super(message, cause);
    }
}
exports.ForbiddenExecution = ForbiddenExecution;
