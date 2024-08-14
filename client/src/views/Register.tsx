import React from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";

import axios from "../api/http.api";
import config from "../utils/config";

import { FInput, FButton, FSelect } from "../utils/inputs";
import { registerInitialData } from "../data/register.data";
import { registrationValidation } from "../validations/registration.validation";

const Register = () => {
  return (
    <Formik
      validationSchema={registrationValidation}
      initialValues={registerInitialData}
      onSubmit={(values) => {
        console.log("API URL", config.API_URL);

        console.log(values);

        const registerUser = async () => {
          try {
            const response = await axios.post(
              "/register",
              JSON.stringify({
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                password: values.password,
                phone: values.phone !== "" ? parseInt(values.phone) : 0,
                dob: values.dob == "" ? "2006-01-02T15:04:05Z" : values.dob,
                gender: values.gender,
                address: values.address,
              })
            );

            console.log(response);
          } catch (err) {
            console.log(err);
          }
        };

        registerUser();
      }}
    >
      {(props) => {
        const { errors, values, handleSubmit, handleChange } = props;

        const handleLoginSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();

          console.log("submitted");
          handleSubmit();
        };

        return (
          <form className="register wrapper">
            <div className="register__container">
              <h3>Register</h3>
              <FInput
                title="First Name *"
                name="firstName"
                value={values.firstName}
                error={errors.firstName}
                type="text"
                onChange={handleChange}
              />
              <FInput
                title="Last Name *"
                name="lastName"
                value={values.lastName}
                error={errors.lastName}
                type="text"
                onChange={handleChange}
              />
              <FInput
                title="Email *"
                name="email"
                value={values.email}
                error={errors.email}
                type="email"
                placeholder="juan@example.com"
                onChange={handleChange}
              />
              <FInput
                title="Password *"
                name="password"
                value={values.password}
                error={errors.password}
                type="password"
                onChange={handleChange}
              />
              <FInput
                title="Phone Number *"
                name="phone"
                value={values.phone}
                error={errors.phone}
                type="text"
                onChange={handleChange}
              />
              <FInput
                title="Date Of Birth *"
                name="dob"
                value={values.lastName}
                error={errors.lastName}
                type="date"
                onChange={handleChange}
              />
              <FSelect
                title="Gender"
                name="gender"
                value={values.gender}
                handleChange={handleChange}
              />
              <FInput
                title="Address *"
                name="address"
                value={values.address}
                error={errors.address}
                type="text"
                onChange={handleChange}
              />

              <FButton disabled={false} onClick={handleLoginSubmit}>
                Sign up
              </FButton>
              <p>
                Already have an account? <Link to="/">Log in</Link>
              </p>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default Register;
