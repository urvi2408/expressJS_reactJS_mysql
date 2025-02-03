const Joi = require("joi");

const getCustomErrors = (err) => {
  const errors = {};
  const processedFields = new Set(); // Track processed fields to avoid duplicates

  if (err.details) {
    err.details.forEach(({ path, message }) => {
      const field = path[0]; // Get the field name
      if (!processedFields.has(field)) {
        errors[field] = message; // Add only the first error for the field
        processedFields.add(field); // Mark this field as processed
      }
    });
  }

  return errors;
};

const createEmployeeValidation = (req, res, next) => {
  //xor is used for or condition means atleast 1 field of mention in xor array fields has value means here in array mention name or email
  //means name or email atleast one of them is required
  //unknown is used for all the remaining body which is not mention validation of that field in this schema allowed.
  const schema = Joi.object()
    .keys({
      name: Joi.string().required().max(10).messages({
        "any.required": "Name is required.",
        "string.empty": "Name is required.",
        "string.max": "Name should have a maximum length of 10",
      }),
      //   password: Joi.string()
      //     .required()
      //     .min(8)
      //     .max(16)
      //     .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"))
      //     .messages({
      //       "any.required": "Password is required.",
      //       "string.empty": "Password is required.",
      //       "string.min": "Password should have a minimum length of 8",
      //       "string.max": "Password should have a maximum length of 16",
      //       "string.pattern.base":
      //         "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      //     }),
      position: Joi.string().max(16).required().messages({
        "any.required": "Position is required.",
        "string.empty": "Position is required.",
        "string.max": "Position should have a maximum length of 16",
      }),
      age: Joi.number()
        .required()
        .when("name", {
          is: "test",
          then: Joi.required(),
          otherwise: Joi.optional(),
        })
        .custom((value, msg) => {
          if (String(value).length > 3) {
            return msg.message("Age should have a maximum length of 3");
          } else {
            return true;
          }
        })
        .messages({
          "number.base": "Age is required.",
          "any.required": "Age is required.",
          "number.empty": "Age is required.",
        }),
      email: Joi.string()
        .required()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "io", "in"] },
        })
        .messages({
          "any.required": "Email is required.",
          "string.empty": "Email is required.",
          "string.email":
            "The email domain must contain at least two segments (e.g., example.com) and must end with .com, .io, or .in.",
        }),
      // optional for used it is not mandatory field but when i fill value on that field it will give validation like regex and all that kind of errors
      //   search: Joi.string().optional(),
      // valid used for values of that field should be only mentioned in the schema and for other values which is not mention in schema give error
      //   category: Joi.string().optional().valid("car", "bike", "truck"),
      // object validations like item:{id:"1" , name:"URVI"} i want to validate id and name
      //   item: Joi.object().keys({
      //     id: Joi.string().required(),
      //     name: Joi.string().required(),
      //   }),
      // array validations like array = [{id:"1" , name:"URVI"}] i want to validate id and name
      //   array: Joi.array().keys({
      //        Joi.object().keys({
      //       id: Joi.string().required(),
      //       name: Joi.string().required(),
      //         })
      //   }),
      // regex validation
      //   email: Joi.string().pattern(new RegExp("regex")).messages({
      //     "string.pattern.base":
      //       "The email format is invalid. Please provide a valid email.",
      //     "any.required": "email is required.",
      //     "string.empty": "email is required.",
      //   }),
      // ref  getvalue of the form field and add validation according to that ref field
      //   confirm_password: Joi.string()
      //     .valid(Joi.ref("password"))
      //     .required()
      //     .messages({
      //       "any.only": "Confirm password must match the password.",
      //       "any.required": "Confirm password is required.",
      //       "string.empty": "Confirm password is required.",
      //     }),
      // custom validation we can add validation on fly onchange value with custom message
      //   custom_name: Joi.string().custom((value, msg) => {
      //     if (value == "test") {
      //       return msg.message("Not allow test name");
      //     } else {
      //       return true;
      //     }
      //   }),
    })
    .xor("email")
    .unknown(true);
  // abortEarly used for send all the fields errors gives together otherwise it will give only 1 field error after resolve 1 field error it give 2nd field error
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res
      .status(400)
      .send({
        message: "Failed to create employee.",
        error: getCustomErrors(error),
      });
  } else {
    next();
  }
};

module.exports = {
  createEmployeeValidation,
};
