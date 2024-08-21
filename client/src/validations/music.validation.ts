import * as Yup from "yup";

export const musicValidation = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  album_name: Yup.string().required("Album Name is required"),
  genre: Yup.string().required("Genre is required"),
  artist_id: Yup.number()
    .typeError("Artist Id must be a number")
    .integer("Artist Id must be an integer")
    .min(1, "Artist Id must be at least 4 digits")
    .required("Artist Id is required"),
  no_of_albums_released: Yup.number()
    .typeError("Number of albums must be a number")
    .integer("Number of albums must be an integer")
    .min(0, "Number of albums cannot be negative")
    .required("Number of albums is required"),
});
