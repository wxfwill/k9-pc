import React from 'react';
import {HashRouter as Router, Route, Switch ,Redirect} from 'react-router-dom';


import AppComponent from 'containers/admin/main/AppComponent';

import LoginComponent from 'containers/login/login';

import ViewComponent from 'containers/view/main/ViewComponent';
// 路由配置
const routes = () => (
  <Router>
    <div className="app">
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/login" push />} />        
        <Route path="/app" component={AppComponent} />
        <Route path="/login" component={LoginComponent} />
        <Route path="/view" component={ViewComponent} />
      </Switch>
    </div>
  </Router>
);
export default routes;
