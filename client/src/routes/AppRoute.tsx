/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import * as view from "./app.view";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";

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
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/login" component={view.Login} />
        <Route exact path="/register" component={view.Register} />
        <Route exact path="/user/edit/:id" component={view.EditUser} />

        <AuthenticatedRoute component={view.Home} path="/" />

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
