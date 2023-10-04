var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "reflect-metadata";
import { compose } from "@hapi/glue";
import path from "path";
import { fileURLToPath } from "url";
import manifest from "./core/manifest";
import plugins from "./core/plugin";
import AppConfig from "./core/config";
import AppRouterInit from "./core/routers";
import { HTTP_STATUS } from "./core/routers/type";
import DatabaseService from "./core/database";
export function bootstrap() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            relativeTo: path.dirname(fileURLToPath(import.meta.url)),
        };
        const registerOptions = { once: true };
        try {
            const server = yield compose(manifest, options);
            yield server.register(plugins, registerOptions);
            server.auth.strategy("jwt", "jwt", {
                key: (_a = AppConfig.jwt) === null || _a === void 0 ? void 0 : _a.secret,
                validate: () => {
                    return { isValid: true };
                },
                verifyOptions: {
                    algorithms: ["HS256"],
                },
            });
            server.ext('onPreResponse', (request, h) => {
                var _a, _b, _c, _d;
                const response = request.response;
                const requestResponse = request.response;
                if (requestResponse.isBoom) {
                    return h
                        .response({
                        message: response.message,
                        statusCode: (_a = requestResponse === null || requestResponse === void 0 ? void 0 : requestResponse.output) === null || _a === void 0 ? void 0 : _a.statusCode,
                        data: null,
                    })
                        .code(requestResponse.output.statusCode);
                }
                else if (((_b = requestResponse === null || requestResponse === void 0 ? void 0 : requestResponse.output) === null || _b === void 0 ? void 0 : _b.statusCode) === HTTP_STATUS.Success) {
                    return h
                        .response({
                        message: response.message,
                        statusCode: (_c = requestResponse === null || requestResponse === void 0 ? void 0 : requestResponse.output) === null || _c === void 0 ? void 0 : _c.statusCode,
                        data: (_d = requestResponse === null || requestResponse === void 0 ? void 0 : requestResponse.output) === null || _d === void 0 ? void 0 : _d.data,
                    })
                        .code(requestResponse.output.statusCode);
                }
                return h.continue;
            });
            const routes = yield AppRouterInit.initialize();
            server.route(routes);
            yield DatabaseService.connect();
            DatabaseService.listenEvent();
            server.start().then(() => __awaiter(this, void 0, void 0, function* () {
                console.info(`Server running on ${server.info.uri}`);
                // await CacheService.bootstrap()
            }));
        }
        catch (error) {
            console.log("🚀 ~ file: main.ts:76 ~ bootstrap ~ error:", error);
            console.error(error);
            process.exit(1);
        }
    });
}
bootstrap();
