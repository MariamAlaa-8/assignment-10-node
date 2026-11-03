import { ApplicationException } from "./main.exception";

export class BadException extends ApplicationException {
    constructor(message : string="BadRequest", cause?: unknown) {
        super(message, 400, cause);
    }
}
export class TooManyException extends ApplicationException {
    constructor(message : string="TooManyException", cause?: unknown) {
        super(message, 429, cause);
    }
}
    
export class ConflictException extends ApplicationException {
    constructor(message : string="conflict", cause?: unknown) {
        super(message, 409, cause);
    }
}
   
export class NotfoundException extends ApplicationException {
    constructor(message : string="Notfound", cause?: unknown) {
        super(message, 404, cause);
    }
}
export class UnauthorizedException extends ApplicationException {
    constructor(message : string="Unauthorized", cause?: unknown) {
        super(message, 401, cause);
    }
}
  
export class UnauthorizedExecution extends UnauthorizedException {
    constructor(message : string="Unauthorized", cause?: unknown) {
        super(message, cause);
    }
}
export class ForbiddenException extends ApplicationException {
    constructor(message : string="Forbidden", cause?: unknown) {
        super(message, 403, cause);
    }
}
 
export class ForbiddenExecution extends ForbiddenException {
    constructor(message : string="Forbidden", cause?: unknown) {
        super(message, cause);
    }
}