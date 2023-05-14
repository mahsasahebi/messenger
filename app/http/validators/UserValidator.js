const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);

const loginValidator = (data)=>{
    const schema = Joi.object({
        mobile : Joi.string().required(),
        password : Joi.string().required()
    });
    return schema.validate(data);
}

const registerValidator = (data)=>{
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        mobile : Joi.string().length(11).required(),
        password : Joi.string().min(3).required()
    });
    return schema.validate(data);

}

module.exports = {loginValidator , registerValidator};