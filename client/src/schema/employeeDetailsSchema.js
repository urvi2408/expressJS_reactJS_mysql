import * as yup from "yup";

const employeeDetailsSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required.")
    .max(10, "Name should have a maximum length of 10"),

  position: yup
    .string()
    .required("Position is required.")
    .max(16, "Position should have a maximum length of 16"),

  age: yup
    .number()
    .required("Age is required.")
    .test("max-length", "Age should have a maximum length of 3", (value) => {
      return value && String(value).length <= 3;
    }),

  officeDays: yup
    .number()
    .required("Office Days is required.")
    .test(
      "max-length",
      "Office Days should have a maximum length of 2",
      (value) => {
        return value && String(value).length <= 2;
      }
    )
    .test(
      "less than 31",
      "Office Days should have a less than of 31",
      (value) => {
        return value && Number(value) <= 31;
      }
    ),

  email: yup
    .string()
    .required("Email is required.")
    .email("The email format is invalid.")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|io|in)$/,
      "Email must end with .com, .io, or .in"
    ),
});
export { employeeDetailsSchema };
