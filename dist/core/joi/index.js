import JoiLib from "joi";
import JoiObjectId from "joi-objectid";
const Joi = Object.assign(Object.assign({}, JoiLib), { objectId: JoiObjectId(JoiLib) });
export default Joi;
