import * as Yup from "yup";

export const artistValidation = Yup.object().shape({
  name: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .max(50, "First name cannot be longer than 50 characters")
    .required("Name is required"),
  dob: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().required("Address is required"),
  first_year_release: Yup.number()
    .typeError("Year must be a number")
    .integer("Year must be an integer")
    .min(1000, "Year must be at least 4 digits")
    .max(2024, "Year must not exceed current year")
    .required("Year is required"),
  no_of_albums_released: Yup.number()
    .typeError("Number of albums must be a number")
    .integer("Number of albums must be an integer")
    .min(0, "Number of albums cannot be negative")
    .required("Number of albums is required"),
});
