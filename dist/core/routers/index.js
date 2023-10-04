var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable no-useless-catch */
import { existsSync } from "fs";
import { getAllFileInModules } from "./utils";
import { MetadataKeys } from "../decorators/constants";
import { HTTP_STATUS } from "./type";
import { trimslash } from "../utils";
import { getClassSchema } from "joi-class-decorators";
import Logging from '../lib/Logging';
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class AppRouterInit {
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [
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
                    const fileInstance = (yield import(element)).default;
                    if (fileInstance) {
                        if (Reflect.hasMetadata(MetadataKeys.IsController, fileInstance)) {
                            const controllerInstance = new fileInstance();
                            const apiTag = Reflect.getMetadata(MetadataKeys.ApiTag, fileInstance) || "Default";
                            const basePath = Reflect.getMetadata(MetadataKeys.BasePath, fileInstance) || "/";
                            const routers = Reflect.getMetadata(MetadataKeys.Routers, fileInstance) || [];
                            for (const element of routers) {
                                const route = element;
                                const routeData = {
                                    method: route.method,
                                    path: trimslash(trimslash(basePath) + route.path),
                                    config: Object.assign(Object.assign({}, (route.routeConfig || {})), { description: route.description, tags: ["api", apiTag], pre: [], validate: {}, handler: (req) => __awaiter(this, void 0, void 0, function* () {
                                            var _a, _b, _c, _d, _e;
                                            try {
                                                const paramDestructuring = [];
                                                if (Reflect.hasMetadata(MetadataKeys.DestructuringParameter, controllerInstance[route.handlerName])) {
                                                    const array = Reflect.getMetadata(MetadataKeys.DestructuringParameter, controllerInstance[route.handlerName]);
                                                    for (let i = 0; i < array.length; i++) {
                                                        const param = array.find((ele) => ele.index === i);
                                                        if ((param === null || param === void 0 ? void 0 : param.name) === "default") {
                                                            paramDestructuring.push((param === null || param === void 0 ? void 0 : param.field) ? req === null || req === void 0 ? void 0 : req[param === null || param === void 0 ? void 0 : param.field] : req);
                                                        }
                                                        else if ((param === null || param === void 0 ? void 0 : param.name) === "pre") {
                                                            paramDestructuring.push((param === null || param === void 0 ? void 0 : param.field) ? (_b = (_a = req === null || req === void 0 ? void 0 : req[param === null || param === void 0 ? void 0 : param.name]) === null || _a === void 0 ? void 0 : _a[param.preField]) === null || _b === void 0 ? void 0 : _b[param === null || param === void 0 ? void 0 : param.field] : (_c = req === null || req === void 0 ? void 0 : req[param === null || param === void 0 ? void 0 : param.name]) === null || _c === void 0 ? void 0 : _c[param === null || param === void 0 ? void 0 : param.preField]);
                                                        }
                                                        else {
                                                            paramDestructuring.push((param === null || param === void 0 ? void 0 : param.field) ? (_d = req === null || req === void 0 ? void 0 : req[param === null || param === void 0 ? void 0 : param.name]) === null || _d === void 0 ? void 0 : _d[param === null || param === void 0 ? void 0 : param.field] : req === null || req === void 0 ? void 0 : req[param === null || param === void 0 ? void 0 : param.name]);
                                                        }
                                                    }
                                                }
                                                const result = yield controllerInstance[route.handlerName](...paramDestructuring);
                                                if ((_e = req.headers) === null || _e === void 0 ? void 0 : _e["template-backend"]) {
                                                    return {
                                                        statusCode: HTTP_STATUS.Success,
                                                        data: result,
                                                        message: "Success",
                                                    };
                                                }
                                                return result;
                                            }
                                            catch (error) {
                                                Logging.error(error);
                                                throw error;
                                            }
                                        }) }),
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
                                            method: (req) => __awaiter(this, void 0, void 0, function* () {
                                                return element.execution(req, element.params);
                                            }),
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
        });
    }
}
