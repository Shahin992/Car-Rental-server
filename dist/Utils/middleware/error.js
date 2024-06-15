"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = void 0;
const createError = (statusCode, message, errors) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.errors = errors;
    return error;
};
exports.createError = createError;
