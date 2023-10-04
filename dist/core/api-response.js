/* eslint-disable @typescript-eslint/no-explicit-any */
import Boom from "boom";
import { HTTP_STATUS } from "./routers/type";
export default class ApiResponse {
    constructor(code, message, data) {
        this.code = HTTP_STATUS.Internal;
        this.data = null;
        this.message = "";
        this.code = code || HTTP_STATUS.Internal;
        this.data = data || null;
        this.message = message || "";
    }
    static BadRequest(message, data = undefined) {
        return Boom.badRequest(message, data);
    }
    static NotFound(message, data = undefined) {
        return Boom.notFound(message, data);
    }
    static Forbidden(message, data = undefined) {
        return Boom.forbidden(message, data);
    }
    static Unauthorized(message, data = undefined) {
        return Boom.unauthorized(message, data);
    }
    static Internal(message, data = undefined) {
        return Boom.internal(message, data);
    }
    static Success(data = undefined, message = 'Success') {
        return {
            statusCode: HTTP_STATUS.Success,
            data,
            message
        };
    }
}
