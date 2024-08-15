export interface Artist {
  id: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
  first_year_release: number;
  no_of_albums_released: number;
  created_at?: string;
  updated_at?: {
    Time: string;
  };
  deleted_at?: {
    Time: string;
  };
}

export interface ArtistsList {
  collection: Artist[];
}

export interface ArtistFormProps {
  initialArtistData: Artist;
  handleCreateArtist: (artist: Artist) => void;
}
