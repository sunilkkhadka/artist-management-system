import { Formik } from "formik";

import { UserFormProps } from "../users.type";
import { userValidation } from "../user.validation";

import FormLayout from "../../../shared/layouts/FormLayout";
import { roles, genders } from "../../../shared/data/input.data";
import { FInput, FSelect, FButton } from "../../../shared/components/inputs";

const UserForm: React.FC<UserFormProps> = ({
  title,
  initialUserData,
  handleUser,
}) => {
  return (
    <Formik
      enableReinitialize
      validationSchema={userValidation}
      initialValues={initialUserData}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={(values, { setSubmitting }) => {
        handleUser(values);
        setSubmitting(false);
      }}
    >
      {(props) => {
        const {
          errors,
          values,
          isSubmitting,
          resetForm,
          handleSubmit,
          handleChange,
          isValid,
        } = props;

        const handleEditCreateUser = (
          e: React.MouseEvent<HTMLButtonElement>
        ) => {
          e.preventDefault();
          handleSubmit();
        };

        return (
          <form className="wrapper">
            <FormLayout title={title}>
              <div className="form-layout">
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
              </div>
              <div className="form-btn">
                <FButton
                  disabled={isSubmitting || !isValid}
                  onClick={handleEditCreateUser}
                >
                  {title}
                </FButton>
                <FButton
                  className="reset"
                  disabled={false}
                  onClick={() => resetForm()}
                >
                  Reset
                </FButton>
              </div>
            </FormLayout>
          </form>
        );
      }}
    </Formik>
  );
};

export default UserForm;
