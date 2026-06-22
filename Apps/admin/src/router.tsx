import { Redirect, Route, Switch } from "wouter";
import { AppList } from "./pages/AppList";
import { Login } from "./pages/Login";
import { AppCreate } from "./pages/AppCreate";
import { AppEdit } from "./pages/AppEdit";

export function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/admin" component={AppList} />
      <Route path="/admin/create" component={AppCreate} />
      <Route path="/admin/edit/:id" component={AppEdit} />
      <Route>
        <Redirect to="/" replace />
      </Route>
    </Switch>
  );
}
