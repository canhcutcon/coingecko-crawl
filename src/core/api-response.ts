/* eslint-disable @typescript-eslint/no-explicit-any */
import Boom from "boom";
import { HTTP_STATUS } from "./routers/type";

export default class ApiResponse {
	code: HTTP_STATUS = HTTP_STATUS.Internal;
	data: any = null;
	message: string = "";
	constructor(code: HTTP_STATUS, message: string, data?: any) {
		this.code = code || HTTP_STATUS.Internal;
		this.data = data || null;
		this.message = message || ""
	}

	static BadRequest(message: string, data: any = undefined) {
		return Boom.badRequest(message, data);
	}

	static NotFound(message: string, data: any = undefined) {
		return Boom.notFound(message, data)
	}

	static Forbidden(message: string, data: any = undefined) {
		return Boom.forbidden(message, data);
	}

	static Unauthorized(message: string, data: any = undefined) {
		return Boom.unauthorized(message, data);
	}

	static Internal(message: string, data: any = undefined) {
		return Boom.internal(message, data);
	}

	static Success(data: any = undefined, message: string = 'Success') {
		return {
			statusCode: HTTP_STATUS.Success,
			data,
			message
		}
	}
}
