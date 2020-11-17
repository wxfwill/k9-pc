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
    // console.log('this.props.routeUrl');
    // console.log(this.props.routeUrl);
    this.setMenuOpen(this.props.routeUrl);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isCollapsed) {
      this.setState({ firstHide: true });
    } else {
      this.setState({ firstHide: false });
    }
    this.setMenuOpen(nextProps.routeUrl);
  }
  setMenuOpen = (pathname) => {
    let menuUrl = pathname;
    // console.log(menuUrl);
    const arr = ['Detail', 'Add', 'Edit', 'UserData'];
    arr.map((item) => {
      if (pathname.includes(item)) {
        menuUrl = pathname.substr(0, pathname.lastIndexOf(item));
      }
    });
    // if (pathname.includes('Detail')) {
    //   menuUrl = pathname.substr(0, pathname.lastIndexOf('Detail'));
    // } else if (pathname.includes('Add')) {
    //   menuUrl = pathname.substr(0, pathname.lastIndexOf('Add'));
    // }
    this.setState({
      openKey: pathname.substr(0, pathname.lastIndexOf('/')),
      selectedKey: menuUrl,
      firstHide: false,
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
  createMenu = (menu = []) => {
    return menu.map((item) => {
      if (item.sub && item.sub.length > 0) {
        return (
          <Menu.SubMenu
            key={item.pathname}
            title={
              <span>
                {item.icon && <Icon type={item.icon} />}
                <span className="nav-text">{item.title}</span>
              </span>
            }
          >
            {this.createMenu(item.sub)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.pathname}>
            <Link to={item.pathname}>
              {item.icon && <Icon type={item.icon} />}
              <span className="nav-text">{item.title}</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  };
  render() {
    const { menus } = this.props;
    return (
      <Sider
        trigger={null}
        width={200}
        breakpoint="lg"
        collapsible
        collapsed={this.props.isCollapsed}
        style={{ background: '#fff', overflowY: 'auto', height: '100%', overflowX: 'hidden' }}
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
});
const mapDispatchToProps = (dispatch) => ({
  isCollapsedAction: () => dispatch(showNavCollapsed()),
  changeRouteAction: (url) => dispatch(changeRoute(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SliderCustom));
// export default withRouter(SliderCustom);
