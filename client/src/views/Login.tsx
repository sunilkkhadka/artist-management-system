import React from "react";
import { Formik } from "formik";
import { Link, useHistory } from "react-router-dom";

import { client } from "../api/http.api";
import { LoginData } from "../data/login.data";
import { FButton, FInput } from "../utils/inputs";

import { AuthState } from "../types/auth.type";
import { useAuthDispatch } from "../hooks/useAuth";
import { loginValidation } from "../validations/login.validation";

const Login = () => {
  const history = useHistory();
  const dispatch = useAuthDispatch();

  return (
    <Formik
      validationSchema={loginValidation}
      initialValues={LoginData}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={(values) => {
        console.log(values);

        const login = async () => {
          try {
            const response = await client.post<AuthState>(
              "/login",
              JSON.stringify({
                email: values.email,
                password: values.password,
              }),
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            dispatch({
              type: "LOGIN",
              payload: {
                email: response?.data?.email,
                username: response?.data?.username,
                role: response?.data?.role,
                token: response?.data?.token,
                isLoggedIn: true,
              },
            });

            localStorage.setItem("at", response?.data?.token);

            history.push("/home");
          } catch (err) {
            console.log(err);
          }
        };

        login();
      }}
    >
      {(props) => {
        const { errors, values, isSubmitting, handleSubmit, handleChange } =
          props;

        const handleLoginSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();

          console.log("submitted");
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

              <FButton disabled={isSubmitting} onClick={handleLoginSubmit}>
                Log In
              </FButton>
              <p>
                Already have an account? <Link to="/register">Sign up</Link>
              </p>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default Login;
