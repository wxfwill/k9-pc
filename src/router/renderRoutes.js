import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import store from '../store/index';

let token = null;

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
            token = store.getState().loginReducer.token;
            // if (!item.requiresAuth || authed || item.path === authPath) {
            //   return <item.component {...props} {...extraProps} route={item} />;
            // }
            if (token || authed || item.path === authPath) {
              return <item.component {...props} {...extraProps} route={item} />;
            }
            return <Redirect to={{pathname: authPath, state: {from: props.location}}} />;
          }}
        />
      ))}
    </Switch>
  );

export default renderRoutes;
