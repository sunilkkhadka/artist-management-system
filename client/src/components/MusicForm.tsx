import { Formik } from "formik";
import { useParams } from "react-router-dom";

import { genres } from "../data/music.data";
import { MusicFormProps } from "../types/music.type";
import { FButton, FInput, FSelect } from "../utils/inputs";
import { musicValidation } from "../validations/music.validation";
import FormLayout from "../layouts/FormLayout";

const MusicForm: React.FC<MusicFormProps> = ({
  title,
  initialMusicData,
  handleMusic,
}) => {
  const { artist_id } = useParams<{ artist_id: string }>();

  return (
    <Formik
      enableReinitialize
      validationSchema={musicValidation}
      initialValues={{ ...initialMusicData, artist_id: parseInt(artist_id) }}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={(values, { setSubmitting }) => {
        handleMusic({
          ...values,
        });
        setSubmitting(false);
      }}
    >
      {(props) => {
        const {
          errors,
          values,
          isSubmitting,
          isValid,
          resetForm,
          handleSubmit,
          handleChange,
        } = props;

        const handleCreateEditMusic = (
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
                  title="Artist Id *"
                  name="artist_id"
                  disabled
                  value={values.artist_id}
                  type="text"
                  error={errors.artist_id}
                  onChange={handleChange}
                />
                <FInput
                  title="Title *"
                  name="title"
                  value={values.title}
                  error={errors.title}
                  type="text"
                  onChange={handleChange}
                />
                <FInput
                  title="Album Name *"
                  name="album_name"
                  value={values.album_name}
                  error={errors.album_name}
                  type="text"
                  onChange={handleChange}
                />
                <FSelect
                  title="Genre"
                  name="genre"
                  data={genres}
                  value={values.genre}
                  handleChange={handleChange}
                />
              </div>
              <div className="form-btn">
                <FButton
                  disabled={isSubmitting || !isValid}
                  onClick={handleCreateEditMusic}
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

export default MusicForm;
