import { Artist } from "./artist.type";
import { getDateInYMDFormat } from "../../shared/utils/date";

export const initialArtistData: Artist = {
  id: "",
  name: "",
  dob: "",
  gender: "",
  address: "",
  first_year_release: 0,
  no_of_albums_released: 0,
};

export const getInitialArtistData = (artist: Artist | undefined): Artist => {
  return {
    id: artist?.id || "",
    name: artist?.name || "",
    dob: getDateInYMDFormat(artist?.dob) || "",
    gender: artist?.gender || "",
    address: artist?.address || "",
    first_year_release: artist?.first_year_release || 0,
    no_of_albums_released: artist?.no_of_albums_released || 0,
  };
};
