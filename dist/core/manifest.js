var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
                failAction: (_request, _h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    console.error('Catch in failAction hook', err);
                    if (process.env.NODE_ENV === 'production') {
                        throw Boom.badRequest('Invalid request payload input');
                    }
                    else {
                        throw Boom.badImplementation(`Error ${err}`);
                    }
                }),
            },
        },
    },
};
export default manifest;
