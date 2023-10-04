import "reflect-metadata";
import { compose, Options } from "@hapi/glue";
import path from "path";
import { fileURLToPath } from "url";
import manifest from "./core/manifest";
import plugins from "./core/plugin";
import AppConfig from "./core/config";
import AppRouterInit from "./core/routers";
import { HTTP_STATUS } from "./core/routers/type";
import DatabaseService from "./core/database";
export async function bootstrap() {
	const options: Options = {
		relativeTo: path.dirname(fileURLToPath(import.meta.url)),
	};
	const registerOptions = { once: true };

	try {
		const server = await compose(manifest, options);
		await server.register(plugins, registerOptions);

		server.auth.strategy("jwt", "jwt", {
			key: AppConfig.jwt?.secret,
			validate: () => {
				return { isValid: true };
			},
			verifyOptions: {
				algorithms: ["HS256"],
			},
		});


		server.ext('onPreResponse', (request, h) => {
			const response = request.response
			const requestResponse: any = request.response
			if (requestResponse.isBoom) {
				return h
					.response({
						message: response.message,
						statusCode: requestResponse?.output?.statusCode,
						data: null,
					})
					.code(requestResponse.output.statusCode)
			} else if (requestResponse?.output?.statusCode === HTTP_STATUS.Success) {
				return h
					.response({
						message: response.message,
						statusCode: requestResponse?.output?.statusCode,
						data: requestResponse?.output?.data,
					})
					.code(requestResponse.output.statusCode)
			}
			return h.continue
		})

		const routes = await AppRouterInit.initialize();
		server.route(routes);

		await DatabaseService.connect();
		DatabaseService.listenEvent();

		server.start().then(async () => {
			console.info(`Server running on ${server.info.uri}`);
			// await CacheService.bootstrap()
		});
	} catch (error) {
		console.log("🚀 ~ file: main.ts:76 ~ bootstrap ~ error:", error)
		console.error(error);
		process.exit(1);
	}
}

bootstrap();
