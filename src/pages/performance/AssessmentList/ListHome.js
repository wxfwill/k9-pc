import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { showNavCollapsed, changeRoute, changeNavName } from 'store/actions/common';

class ListHome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location, history, route } = this.props;
    return <div>{renderRoutes(route.routes)}</div>;
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
  systomState: state.system,
  isCollapsed: state.commonReducer.collapsed,
  navData: state.commonReducer.navData,
  routeUrl: state.commonReducer.routeUrl,
  menus: state.loginReducer.menuList,
});
const mapDispatchToProps = (dispatch) => ({
  isCollapsedAction: () => dispatch(showNavCollapsed()),
  changeRouteAction: (url) => dispatch(changeRoute(url)),
  changeNavNameAction: (bread) => dispatch(changeNavName(bread)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListHome));
