import * as Yup from "yup";

export const musicValidation = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  album_name: Yup.string().required("Album Name is required"),
  genre: Yup.string().required("Genre is required"),
});
