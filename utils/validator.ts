import joi from "joi";

// let regex =
//   /^(?!.\s)(?=.[A-Z])(?=.[a-z])(?=.[0-9])(?=.[~`!@#$%^&()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;
export const createValidator = joi.object({
  name: joi.string().required(),
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().required(),
  confirm: joi.ref("password"),
});

export const createLawyerValidator = joi.object({
  name: joi.string().required(),
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().required(),
  confirm: joi.ref("password"),
  secret:joi.string().required()
});

export const signInValidator = joi.object({
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().required(),
});

export const resetValidator = joi.object({
  email: joi.string().email().lowercase().trim().required(),
});

export const changeValidator = joi.object({
  password: joi.string().required(),
});
