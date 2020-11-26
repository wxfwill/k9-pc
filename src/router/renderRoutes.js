import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../store/index';

@connect(
  (state) => ({ userInfo: state.loginReducer.userInfo })
  // (dispatch) => ({ changeNavData: (nav) => dispatch(changeNavName(nav)) })
)
class Child extends React.Component {
  componentDidMount() {
    console.log('child===www');
    console.log(this.props.userInfo);
  }
  render() {
    return null;
  }
}

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
            console.log('token====' + token);
            // if (!item.requiresAuth || authed || item.path === authPath) {
            //   return <item.component {...props} {...extraProps} route={item} />;
            // }
            if (token || authed || item.path === authPath) {
              return <item.component {...props} {...extraProps} route={item} />;
            }
            return <Redirect to={{ pathname: authPath, state: { from: props.location } }} />;
          }}
        />
      ))}
    </Switch>
  );

export default renderRoutes;
