/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import * as view from "./app.view";
import Header from "../shared/components/Header";
import { useAuth } from "../features/auth/hooks/useAuth";

interface AuthenticatedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  location?: any;
  children?: React.ReactNode;
}

const AppRoute = () => {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/login" component={view.Login} />
        <Route exact path="/register" component={view.Register} />
        <AuthenticatedRoute
          exact
          path="/user/edit/:id"
          component={view.EditUser}
        />
        <AuthenticatedRoute
          exact
          path="/user/create"
          component={view.CreateUser}
        />
        <AuthenticatedRoute
          exact
          path="/artist/create"
          component={view.CreateArtist}
        />
        <AuthenticatedRoute
          exact
          path="/artist/edit/:id"
          component={view.EditArtist}
        />
        <AuthenticatedRoute
          exact
          path="/artist/music/:artist_id"
          component={view.MusicList}
        />

        <AuthenticatedRoute
          exact
          path="/music/create/:artist_id"
          component={view.CreateMusic}
        />

        {auth.role != "artist" ? (
          <AuthenticatedRoute component={view.Home} path="/" />
        ) : (
          <AuthenticatedRoute component={view.MusicList} path="/" />
        )}

        <Route path="*" component={() => <h1>Page Not Found</h1>} />
      </Switch>
    </BrowserRouter>
  );
};

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        auth.isLoggedIn ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AppRoute;
