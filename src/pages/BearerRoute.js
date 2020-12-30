import React from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

class ListHome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location, history, route } = this.props;
    return <div style={{ height: '100%' }}>{renderRoutes(route.items)}</div>;
  }
}

export default withRouter(ListHome);
