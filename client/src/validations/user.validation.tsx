import * as Yup from "yup";

export const userValidation = Yup.object().shape({
  firstname: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .max(50, "First name cannot be longer than 50 characters")
    .required("First name is required"),
  lastname: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .max(50, "Last name cannot be longer than 50 characters")
    .required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[a-zA-Z0-9!@#$%^&*]/,
      "Password must contain at least one special character"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  phone: Yup.string().length(10, "Phone number must be exactly 10 digits"),
  dob: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().required("Address is required"),
});
