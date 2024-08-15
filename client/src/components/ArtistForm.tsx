import { Formik } from "formik";
import { FButton, FInput, FSelect } from "../utils/inputs";

import { genders } from "../data/edit-user.data";
import { ArtistFormProps } from "../types/artist.type";
import { artistValidation } from "../validations/artist.validation";

const ArtistForm: React.FC<ArtistFormProps> = ({
  initialArtistData,
  handleCreateArtist,
}) => {
  return (
    <Formik
      enableReinitialize
      validationSchema={artistValidation}
      initialValues={initialArtistData}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={(values) => {
        console.log(values);
        handleCreateArtist({
          ...values,
          dob: new Date(values.dob).toISOString(),
          first_year_release: Number(values.first_year_release),
          no_of_albums_released: Number(values.no_of_albums_released),
        });
      }}
    >
      {(props) => {
        const { errors, values, isSubmitting, handleSubmit, handleChange } =
          props;

        const handleUpdateUser = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          handleSubmit();
        };

        return (
          <form className="wrapper">
            <div className="">
              <h3>Create Artist</h3>
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

              <FButton disabled={isSubmitting} onClick={handleUpdateUser}>
                Create Artist
              </FButton>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default ArtistForm;
