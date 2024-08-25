import { Formik } from "formik";

import FormLayout from "../../../shared/layouts/FormLayout";
import { ArtistFormProps } from "../artist.type";
import { artistValidation } from "../validations/artist.validation";

import { genders } from "../../../shared/data/input.data";
import { getDateInISOFormat } from "../../../shared/utils/date";
import { FInput, FSelect, FButton } from "../../../shared/components/inputs";

const ArtistForm: React.FC<ArtistFormProps> = ({
  title,
  initialArtistData,
  handleArtist,
}) => {
  return (
    <Formik
      enableReinitialize
      validationSchema={artistValidation}
      initialValues={initialArtistData}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={(values, { setSubmitting }) => {
        handleArtist({
          ...values,
          dob: getDateInISOFormat(values.dob),
          first_year_release: Number(values.first_year_release),
          no_of_albums_released: Number(values.no_of_albums_released),
        });
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

        const handleUpdateUser = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          handleSubmit();
        };

        return (
          <form className="wrapper">
            <FormLayout title={title}>
              <div className="form-layout">
                <FInput
                  title="Name *"
                  name="name"
                  value={values.name}
                  error={errors.name}
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

                <FInput
                  title="First Year Release *"
                  name="first_year_release"
                  value={values.first_year_release}
                  error={errors.first_year_release}
                  type="text"
                  onChange={handleChange}
                />

                <FInput
                  title="Number of Albums Released *"
                  name="no_of_albums_released"
                  value={values.no_of_albums_released}
                  error={errors.no_of_albums_released}
                  type="text"
                  onChange={handleChange}
                />
              </div>
              <div className="form-btn">
                <FButton
                  disabled={isSubmitting || !isValid}
                  onClick={handleUpdateUser}
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

export default ArtistForm;
