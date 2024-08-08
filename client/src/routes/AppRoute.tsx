import { BrowserRouter, Switch, Route } from "react-router-dom";

import * as view from "./app.view";

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={view.Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRoute;
