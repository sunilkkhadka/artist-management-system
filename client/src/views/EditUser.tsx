import { Formik } from "formik";
import { useParams } from "react-router-dom";

import { useGetUserById } from "../hooks/useFetchUsers";
import { FButton, FInput, FSelect } from "../utils/inputs";

import { editUserValidation } from "../validations/user.validation";
import { genders, getInitialUserData, roles } from "../data/edit-user.data";
import { useMutation } from "@tanstack/react-query";
import { User } from "../types/users.type";
import { updateUserById } from "../api/api.service";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isError, isLoading } = useGetUserById(parseInt(id));

  const updateUserMutation = useMutation({
    mutationFn: (user: User) => updateUserById(user),
  });

  if (isLoading) {
    return <h1>Loading User Data...</h1>;
  }

  if (isError) {
    return <h1>Something went wrong...</h1>;
  }

  const initialUserData = getInitialUserData(data);

  console.log(initialUserData);

  return (
    <Formik
      enableReinitialize
      validationSchema={editUserValidation}
      initialValues={initialUserData}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={(values) => {
        console.log(values);
        updateUserMutation.mutate(values);
      }}
    >
      {(props) => {
        const { errors, values, isSubmitting, handleSubmit, handleChange } =
          props;

        const handleUpdateUser = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();

          console.log("submitted");
          handleSubmit();
        };

        console.log("VALUES", values);

        return (
          <form className="wrapper">
            <div className="">
              <h3>Edit User</h3>
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
                title="Role"
                name="role"
                data={roles}
                value={values.role}
                handleChange={handleChange}
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

              <FButton disabled={isSubmitting} onClick={handleUpdateUser}>
                Update user
              </FButton>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default EditUser;
