/* eslint-disable no-useless-catch */
import { existsSync } from "fs";
import { getAllFileInModules } from "./utils";
import { MetadataKeys } from "../decorators/constants";
import { HTTP_STATUS, IRouter } from "./type";
import { trimslash } from "../utils";
import { getClassSchema } from "joi-class-decorators";
import Logging from '../lib/Logging';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class AppRouterInit {
	static async initialize() {
		const result: any[] = [
			{
				method: "GET",
				path: "/favicon.ico",
				handler: function (_, h) {
					return h.file("favicon.ico");
				},
			},
		];
		const files = getAllFileInModules();
		for (const element of files) {
			if (existsSync(element)) {
				const fileInstance = (await import(element)).default;
				if (fileInstance) {
					if (Reflect.hasMetadata(MetadataKeys.IsController, fileInstance)) {
						const controllerInstance: any = new fileInstance();
						const apiTag: string = Reflect.getMetadata(MetadataKeys.ApiTag, fileInstance) || "Default";
						const basePath: string = Reflect.getMetadata(MetadataKeys.BasePath, fileInstance) || "/";
						const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.Routers, fileInstance) || [];

						for (const element of routers) {
							const route = element;
							const routeData: any = {
								method: route.method,
								path: trimslash(trimslash(basePath) + route.path),
								config: {
									...(route.routeConfig || {}),
									description: route.description,
									tags: ["api", apiTag],
									pre: [],
									validate: {},
									handler: async (req: any) => {
										try {
											const paramDestructuring: any[] = [];
											if (Reflect.hasMetadata(MetadataKeys.DestructuringParameter, controllerInstance[route.handlerName])) {
												const array = Reflect.getMetadata(MetadataKeys.DestructuringParameter, controllerInstance[route.handlerName]);
												for (let i = 0; i < array.length; i++) {
													const param = array.find((ele: any) => ele.index === i);
													if (param?.name === "default") {
														paramDestructuring.push(param?.field ? req?.[param?.field] : req);
													} else if (param?.name === "pre") {
														paramDestructuring.push(
															param?.field ? req?.[param?.name]?.[param.preField]?.[param?.field] : req?.[param?.name]?.[param?.preField]
														);
													} else {
														paramDestructuring.push(param?.field ? req?.[param?.name]?.[param?.field] : req?.[param?.name]);
													}
												}
											}
											const result = await controllerInstance[route.handlerName](...paramDestructuring);
											if (req.headers?.["template-backend"]) {
												return {
													statusCode: HTTP_STATUS.Success,
													data: result,
													message: "Success",
												};
											}
											return result;
										} catch (error) {
											Logging.error(error)
											throw error;
										}
									},
								},
							};
							if (Reflect.hasMetadata(MetadataKeys.ValidationQuery, controllerInstance[route.handlerName])) {
								const validateQuery = Reflect.getMetadata(MetadataKeys.ValidationQuery, controllerInstance[route.handlerName]);
								routeData.config.validate.query = getClassSchema(validateQuery);
							}
							if (Reflect.hasMetadata(MetadataKeys.ValidationQueryOptional, controllerInstance[route.handlerName])) {
								const validateQuery = Reflect.getMetadata(MetadataKeys.ValidationQueryOptional, controllerInstance[route.handlerName]);
								routeData.config.validate.query = getClassSchema(validateQuery).optional();
							}
							if (Reflect.hasMetadata(MetadataKeys.ValidationParams, controllerInstance[route.handlerName])) {
								const validateParams = Reflect.getMetadata(MetadataKeys.ValidationParams, controllerInstance[route.handlerName]);
								routeData.config.validate.params = getClassSchema(validateParams);
							}
							if (Reflect.hasMetadata(MetadataKeys.ValidationParamsOptional, controllerInstance[route.handlerName])) {
								const validateParams = Reflect.getMetadata(MetadataKeys.ValidationParamsOptional, controllerInstance[route.handlerName]);
								routeData.config.validate.params = getClassSchema(validateParams).optional();
							}
							if (Reflect.hasMetadata(MetadataKeys.ValidationPayload, controllerInstance[route.handlerName])) {
								const validatePayload = Reflect.getMetadata(MetadataKeys.ValidationPayload, controllerInstance[route.handlerName]);
								routeData.config.validate.payload = getClassSchema(validatePayload);
							}
							if (Reflect.hasMetadata(MetadataKeys.ValidationPayloadOptional, controllerInstance[route.handlerName])) {
								const validatePayload = Reflect.getMetadata(MetadataKeys.ValidationPayloadOptional, controllerInstance[route.handlerName]);
								routeData.config.validate.payload = getClassSchema(validatePayload).optional();
							}
							if (Reflect.hasMetadata(MetadataKeys.Middleware, controllerInstance[route.handlerName])) {
								const middleware = Reflect.getMetadata(MetadataKeys.Middleware, controllerInstance[route.handlerName]);
								const pre = [];
								for (const element of middleware) {
									pre.push({
										method: async (req) => {
											return element.execution(req, element.params);
										},
										assign: element.assign,
									});
								}
								routeData.config.pre = pre;
							}
							result.push(routeData);
						}
					}
				}
			}
		}
		return result;
	}
}
