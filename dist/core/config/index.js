import Joi from "joi";
import config from "config";
import Boom from "boom";
const configSchema = Joi.object({
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
});
const AppConfig = {
    load: () => {
        const { error, value } = configSchema
            .prefs({
            errors: {
                label: "key",
            },
        })
            .validate(JSON.parse(JSON.stringify(config)));
        if (error) {
            throw Boom.badImplementation(`${error}`);
        }
        const configValue = JSON.parse(JSON.stringify(value));
        Object.keys(configValue).forEach((key) => {
            AppConfig[key] = configValue[key];
        });
        const result = JSON.parse(JSON.stringify(Object.assign(Object.assign({}, AppConfig), { load: undefined })));
        return result;
    },
};
AppConfig.load();
export default AppConfig;
