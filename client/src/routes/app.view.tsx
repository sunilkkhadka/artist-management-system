import { lazy } from "react";

export const Home = lazy(() => import("../views/Home"));
export const Login = lazy(() => import("../views/Login"));
export const Register = lazy(() => import("../views/Register"));
export const EditUser = lazy(() => import("../views/EditUser"));
export const CreateArtist = lazy(() => import("../views/CreateArtist"));
export const EditArtist = lazy(() => import("../views/EditArtist"));
