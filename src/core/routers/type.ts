export enum Methods {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	PATCH = "PATCH",
	DELETE = "DELETE",
}

export interface IRouter {
	method: Methods;
	path: string;
	description?: string;
	handlerName: string | symbol;
	routeConfig?: object;
	pre?: any
}

export enum HTTP_STATUS {
	Success = 200,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	Internal = 500,
}
