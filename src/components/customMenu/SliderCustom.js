import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Icon } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { showNavCollapsed, changeRoute } from 'store/actions/common';

const { Sider } = Layout;

class SliderCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
      // openKey: this.props.routeUrl.substr(0, this.props.routeUrl.lastIndexOf('/')),
      openKey: '',
      selectedKey: '',
      firstHide: false, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    if (this.props.isCollapsed) {
      this.setState({ firstHide: true });
    }
    this.setMenuOpen(this.props.history.location.pathname);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isCollapsed) {
      this.setState({ firstHide: true });
    } else {
      this.setState({ firstHide: false });
    }
    this.setMenuOpen(nextProps.location.pathname);
  }
  setMenuOpen = (pathname) => {
    let menuUrl = pathname;
    this.setState({
      openKey: menuUrl.split('/').slice(0, 3).join('/'),
      selectedKey: menuUrl.split('/').slice(0, 4).join('/'),
    });
  };
  menuClick = (e) => {
    this.setState({
      selectedKey: e.key,
    });
  };
  openMenu = (v) => {
    this.setState({
      openKey: v[v.length - 1],
      firstHide: false,
    });
  };
  createMenu = (menu) => {
    return menu && menu.length > 0
      ? menu.map((item) => {
          if (item.children && item.children.length > 0) {
            return (
              <Menu.SubMenu
                key={item.url.split('/').slice(0, 3).join('/')}
                title={
                  <span>
                    {item.icon && <Icon type={item.icon} />}
                    <span className="nav-text">{item.name}</span>
                  </span>
                }
              >
                {this.createMenu(item.children)}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={item.url.split('/').slice(0, 4).join('/')}>
                <Link to={item.url}>
                  {item.icon && <Icon type={item.icon} />}
                  <span className="nav-text">{item.name}</span>
                </Link>
              </Menu.Item>
            );
          }
        })
      : null;
  };
  render() {
    const { menus } = this.props;
    console.log(menus);
    return (
      <Sider
        trigger={null}
        width={200}
        breakpoint="lg"
        collapsible
        collapsed={this.props.isCollapsed}
        style={{
          background: '#fff',
          overflowY: 'auto',
          height: '100%',
          overflowX: 'hidden',
          display: this.props.isShowGridMap ? 'none' : 'block',
        }}
      >
        <Menu
          mode="inline"
          onClick={this.menuClick}
          selectedKeys={[this.state.selectedKey]}
          openKeys={this.state.firstHide ? null : [this.state.openKey]}
          onOpenChange={this.openMenu}
          style={{ height: '100%', borderRight: 0 }}
        >
          {this.createMenu(menus)}
        </Menu>
        {/* <Menu
          mode="inline"
          onClick={this.menuClick}
          selectedKeys={[this.props.routeUrl]}
          openKeys={this.state.firstHide ? null : [this.state.openKey]}
          onOpenChange={this.openMenu}
          style={{ height: '100%', borderRight: 0 }}
        >
          {this.createMenu(menus)}
        </Menu> */}
      </Sider>
    );
  }
}

const mapStateToProps = (state) => ({
  isCollapsed: state.commonReducer.collapsed,
  routeUrl: state.commonReducer.routeUrl,
  isShowGridMap: state.commonReducer.isShowGridMap,
});
const mapDispatchToProps = (dispatch) => ({
  isCollapsedAction: () => dispatch(showNavCollapsed()),
  changeRouteAction: (url) => dispatch(changeRoute(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SliderCustom));
// export default withRouter(SliderCustom);
