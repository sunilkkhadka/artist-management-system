import React from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";

import { genders } from "../../../data/user.data";
import { useRegisterUser } from "../hooks/useAuth";
import { registerInitialData } from "../auth.data";

import { getDateInISOFormat } from "../../../shared/utils/date";
import { registrationValidation } from "../auth.validation";
import { FInput, FSelect, FButton } from "../../../shared/components/inputs";

const Register = () => {
  const registerMutation = useRegisterUser();

  return (
    <Formik
      validationSchema={registrationValidation}
      initialValues={registerInitialData}
      onSubmit={(values) => {
        registerMutation.mutate({
          ...values,
          dob: getDateInISOFormat(values.dob),
          phone: Number(values.phone),
        });
      }}
    >
      {(props) => {
        const { errors, values, handleSubmit, handleChange } = props;

        const handleLoginSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          handleSubmit();
        };

        return (
          <form className="register wrapper">
            <div className="register__container">
              <h3>Register</h3>
              <FInput
                title="First Name *"
                name="firstname"
                value={values.firstname}
                error={errors.firstname}
                type="text"
                onChange={handleChange}
              />
              <FInput
                title="Last Name *"
                name="lastname"
                value={values.lastname}
                error={errors.lastname}
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
                value={values.dob}
                error={errors.dob}
                type="date"
                onChange={handleChange}
              />
              <FSelect
                title="Gender"
                name="gender"
                data={genders}
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
              <br />
              <p>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default Register;
