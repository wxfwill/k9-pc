import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthRouter from 'components/AuthRouter';
import routerArr from './allRouter';

import Main from 'pages/main/Main';
import LoginComponent from 'pages/login/Login';

// 路由配置
class Routes extends Component {
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    return (
      <HashRouter>
        <div className="app">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" push />} />
            <Route path="/login" component={LoginComponent} />
            <Route
              render={() => {
                return (
                  <Main>
                    <Switch>
                      {routerArr.map((item, index) => {
                        return <AuthRouter key={index} path={item.path} component={item.component} meta={item.meta} />;
                      })}
                    </Switch>
                  </Main>
                );
              }}
            />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}
export default Routes;
