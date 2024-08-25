import { lazy } from "react";

export const Home = lazy(() => import("../views/Home"));
export const Login = lazy(() => import("../views/Login"));
export const Register = lazy(() => import("../views/Register"));
export const EditUser = lazy(() => import("../views/EditUser"));
export const MusicList = lazy(() => import("../views/MusicList"));
export const EditArtist = lazy(() => import("../views/EditArtist"));
export const CreateUser = lazy(() => import("../views/CreateUser"));
export const CreateMusic = lazy(() => import("../views/CreateMusic"));
export const CreateArtist = lazy(() => import("../views/CreateArtist"));
