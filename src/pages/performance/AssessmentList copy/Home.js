import React, { Component } from 'react';
import { HashRouter, Route, Link, Switch } from 'react-router-dom';
import Index from './index';
import Main from './Main';
import Info from './Info';

class HomeList extends Component {
  render() {
    return (
      <Index>
        <Switch>
          <Route
            path="/app/performance/assessmentList"
            render={() => (
              <Main>
                <Route path="/app/performance/assessmentList/:mainid" component={Info}></Route>
              </Main>
            )}
          ></Route>
        </Switch>
      </Index>
    );
  }
}

export default HomeList;
