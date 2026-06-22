import { Redirect, Route, Switch } from 'wouter';
import { AppList } from './pages/AppList'
import { Login } from './pages/Login'


export function Router() {
    return(
        <Switch>
            <Route path='/' component={Login} />
            <Route path='/admin' component={AppList} />
            <Route>
                <Redirect to='/' replace />
            </Route>
        </Switch>
    )
}