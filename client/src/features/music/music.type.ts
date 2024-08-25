export interface Music {
  id: string;
  artist_id?: number;
  artist_name: string;
  title: string;
  album_name: string;
  genre: string;
  created_at?: string;
  updated_at?: {
    Time: string;
  };
  deleted_at?: {
    Time: string;
  };
}

export interface MusicsList {
  collection: Music[];
}

export interface MusicFormProps {
  title: string;
  initialMusicData: Music;
  handleMusic: (music: Music) => void;
}
