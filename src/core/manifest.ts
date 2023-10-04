import path from "path";
import { fileURLToPath } from "url";
import Boom from "boom";
import AppConfig from "./config";

const manifest = {
	server: {
		router: {
			isCaseSensitive: false,
			stripTrailingSlash: true,
		},
		port: AppConfig.port,
		routes: {
			cors: {
				additionalHeaders: ['template-backend'],
			},
			files: {
				relativeTo: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public'),
			},
			validate: {
				failAction: async (_request: any, _h: any, err: any) => {
					console.error('Catch in failAction hook', err)
					if (process.env.NODE_ENV === 'production') {
						throw Boom.badRequest('Invalid request payload input')
					} else {
						throw Boom.badImplementation(`Error ${err}`)
					}
				},
			},
		},
	},
};

export default manifest;
