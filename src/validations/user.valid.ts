import Joi from "joi";

const registerValidater=Joi.object({

    fullName:Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
            .message('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number')
            .required(),
})

export const userValidate =(user:any)=>{
    return registerValidater.validate(user);    
}