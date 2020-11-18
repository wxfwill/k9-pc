import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
const renderRoutes = (arr, authed, authPath = '/login', extraProps = {}, switchProps = {}) =>
  arr && (
    <Switch {...switchProps}>
      {arr.map((item, i) => (
        <Route
          key={item.key || i}
          path={item.path}
          exact={item.exact}
          strict={item.strict}
          render={(props) => {
            if (!item.requiresAuth || authed || item.path === authPath) {
              return <item.component {...props} {...extraProps} route={item} />;
            }
            return <Redirect to={{ pathname: authPath, state: { from: props.location } }} />;
          }}
        />
      ))}
    </Switch>
  );

export default renderRoutes;
