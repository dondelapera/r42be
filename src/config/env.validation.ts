import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().port().required(),
  DB_CONNECTION: Joi.string().required(),
});
