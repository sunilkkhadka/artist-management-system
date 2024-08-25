import React from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";

import { LoginData } from "../data/auth.data";
import { FButton, FInput } from "../utils/inputs";

import { useLoginUser } from "../hooks/useAuth";
import { loginValidation } from "../validations/login.validation";

const Login = () => {
  const loginMutation = useLoginUser();

  return (
    <Formik
      validationSchema={loginValidation}
      initialValues={LoginData}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={(values, actions) => {
        loginMutation.mutate(values);
        actions.setSubmitting(false);
      }}
    >
      {(props) => {
        const {
          errors,
          values,
          isValid,
          isSubmitting,
          handleSubmit,
          handleChange,
        } = props;

        const handleLoginSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();

          handleSubmit();
        };

        return (
          <form className="login wrapper">
            <div className="login__container">
              <h3>Login</h3>
              <FInput
                title="Email"
                name="email"
                value={values.email}
                error={errors.email}
                type="email"
                onChange={handleChange}
              />
              <FInput
                title="Password"
                name="password"
                value={values.password}
                error={errors.password}
                type="password"
                onChange={handleChange}
              />

              <FButton
                disabled={isSubmitting || !isValid}
                onClick={handleLoginSubmit}
              >
                Log In
              </FButton>
              <p className="login__sign-up-link">
                Already have an account?
                <Link className="login__sign-up" to="/register">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default Login;
