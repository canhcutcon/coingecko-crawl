import JoiLib from "joi";
import JoiObjectId from "joi-objectid";

type JoiType = typeof JoiLib & {
	objectId: () => JoiLib.StringSchema;
};

const Joi: JoiType = {
	...JoiLib,
	objectId: JoiObjectId(JoiLib),
};

export default Joi;
