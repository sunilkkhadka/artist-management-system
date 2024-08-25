import { lazy } from "react";

export const Home = lazy(() => import("../features/dashboard/views/Home"));
export const Login = lazy(() => import("../features/auth/views/Login"));
export const Register = lazy(() => import("../features/auth/views/Register"));
export const EditUser = lazy(() => import("../features/user/views/EditUser"));
export const MusicList = lazy(
  () => import("../features/music/views/MusicList")
);
export const EditArtist = lazy(
  () => import("../features/artist/views/EditArtist")
);
export const CreateUser = lazy(
  () => import("../features/user/views/CreateUser")
);
export const CreateMusic = lazy(
  () => import("../features/music/views/CreateMusic")
);
export const CreateArtist = lazy(
  () => import("../features/artist/views/CreateArtist")
);
