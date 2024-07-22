import Validator from "@hapi/joi";

const formSchemas = {
  registration: Validator.object({
    name: Validator.string().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty",
    }),
    email: Validator.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email cannot be empty",
    }),
    password: Validator.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password cannot be empty",
    }),
    confirmPassword: Validator.string().min(6).required().messages({
      "any.required": "Confirm Password is required",
      "string.min": "Confirm Password must be at least 6 characters long",
      "string.empty": "Confirm Password cannot be empty",
    }),
  }),
  login: Validator.object({
    email: Validator.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email cannot be empty",
    }),
    password: Validator.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password cannot be empty",
    }),
  }),
  editUser: Validator.object({
    name: Validator.string().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty",
    }),
  }),
  passwordChange: Validator.object({
    password: Validator.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password cannot be empty",
    }),
    confirmPassword: Validator.string().min(6).required().messages({
      "any.required": "Confirm Password is required",
      "string.min": "Confirm Password must be at least 6 characters long",
      "string.empty": "Confirm Password cannot be empty",
    }),
  }),
};

const formValidate = (data, formType) => {
  if (!formSchemas[formType]) {
    throw new Error(`Invalid form type: ${formType}`);
  }
  return formSchemas[formType].validate(data);
};

export default formValidate;
