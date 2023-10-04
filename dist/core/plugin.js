var _a;
/* eslint-disable @typescript-eslint/no-explicit-any */
import hapiAuthJwt2 from "hapi-auth-jwt2";
import hapi_swagger from "hapi-swagger";
import hapiInert from "@hapi/inert";
import hapiVision from "@hapi/vision";
import AppConfig from "./config";
import laabr from "laabr";
const plugins = [];
plugins.push({
    plugin: hapiAuthJwt2,
    options: AppConfig.jwt,
});
plugins.push({
    plugin: hapi_swagger,
    options: {
        info: {
            title: AppConfig.documentation.options.info.title,
            version: AppConfig.documentation.options.info.version,
        },
        schemes: [((_a = AppConfig.documentation) === null || _a === void 0 ? void 0 : _a.schemas) || "http"],
        grouping: "tags",
        securityDefinitions: {
            jwt: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
            },
        },
        security: [{ jwt: [] }],
    },
});
plugins.push({
    plugin: hapiInert,
});
plugins.push({
    plugin: hapiVision,
    options: {},
});
plugins.push({
    plugin: laabr,
    options: {
        override: false,
        formats: {
            log: ":level - :message",
            response: ":method, :url, :status, :payload, (:responseTime ms)",
            "request-error": 
            // eslint-disable-next-line max-len
            ":method, :url, :payload, :error[output.statusCode], :error, :error[stack]",
            onPostStart: ":level - :message",
            onPostStop: ":level - :message",
        },
        indent: 0,
        colored: true,
        hapiPino: {
            prettyPrint: AppConfig.env,
            mergeHapiLogData: true,
            ignoreFunc: (options, request) => request.path.startsWith("/swagger") ||
                request.path.startsWith("/assets") ||
                request.path.includes("/favicon") ||
                request.path.includes("/upload/base64-image") ||
                request.path.includes("/upload/review/base64") ||
                request.method === "options",
            logPayload: true,
        },
    },
});
export default plugins;
