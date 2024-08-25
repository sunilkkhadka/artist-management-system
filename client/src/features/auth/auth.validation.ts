import * as Yup from "yup";

export const loginValidation = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[a-zA-Z0-9!@#$%^&*]/,
      "Password must contain at least one special character"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
});

export const registrationValidation = Yup.object().shape({
  firstname: Yup.string().trim().required("First name is required"),
  lastname: Yup.string().trim().required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[a-zA-Z0-9!@#$%^&*]/,
      "Password must contain at least one special character"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  phone: Yup.string()
    .trim()
    .length(10, "Phone number must be exactly 10 digits"),
  dob: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().trim().required("Address is required"),
});
