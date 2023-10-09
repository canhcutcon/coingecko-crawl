import Joi from "joi";
import config from "config";
import Boom from "boom";

export type ConfigType = {
	env?: "development";
	port?: number;
	documentation?: {
		enabled?: boolean;
		schemas?: string;
		options?: {
			info?: {
				title: string;
				version: string;
			};
			grouping?: string;
			documentationPage?: boolean;
		};
	};
	jwt?: {
		secret?: string;
		expirerIn?: string;
	};
	database?: {
		uri?: string;
	};
	redis?: {
		prefix: string
		host?: string
		port?: number
		password?: string
	};

};

const configSchema = Joi.object<ConfigType>({
	env: Joi.string().valid("development", "test").required(),
	port: Joi.number().required(),
	documentation: Joi.object({
		enable: Joi.boolean().required(),
		schemes: Joi.string().valid("http", "https").required(),
		options: Joi.object({
			info: Joi.object({
				title: Joi.string().required(),
				version: Joi.string().required(),
			}),
			grouping: Joi.string().required(),
			documentationPage: Joi.boolean().required(),
		}),
	}).required(),
	jwt: Joi.object({
		secret: Joi.string().required(),
		expiredIn: Joi.string().required(),
	}).required(),
	database: Joi.object({
		uri: Joi.string().required(),
	}).required(),
	redis: Joi.object({
		prefix: Joi.string().required(),
		host: Joi.string().allow('').optional(),
		port: Joi.number().optional(),
		password: Joi.string().allow('').optional(),
	}).required(),
});

const AppConfig: ConfigType & {
	load: () => ConfigType;
} = {
	load: () => {
		const { error, value } = configSchema
			.prefs({
				errors: {
					label: "key",
				},
			})
			.validate(JSON.parse(JSON.stringify(config)));
		if (error) {
			throw Boom.badImplementation(`${error}`)
		}
		const configValue: any = JSON.parse(JSON.stringify(value));
		Object.keys(configValue).forEach((key) => {
			AppConfig[key] = configValue[key];
		});
		const result = JSON.parse(JSON.stringify({ ...AppConfig, load: undefined }));
		return result;
	},
};

AppConfig.load();

export default AppConfig;
