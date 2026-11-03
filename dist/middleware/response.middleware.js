"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
const ResponseFormatter = (handler) => {
    return async (req, res, next) => {
        if (res.headersSent)
            return;
        const { message = true, status = 200, data = undefined, meta = undefined, } = await handler(req, res, next) ?? {};
        return res.status(status).json({
            message: message,
            data: data,
            meta: meta,
        });
    };
};
exports.ResponseFormatter = ResponseFormatter;
