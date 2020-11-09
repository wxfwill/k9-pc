/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Icon } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import SiderMenu from './SiderMenu';
import { showNavCollapsed, changeRoute } from 'store/actions/common';

const { Sider } = Layout;

class SliderCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
      openKey: this.props.routeUrl.substr(0, this.props.routeUrl.lastIndexOf('/')),
      selectedKey: '',
      firstHide: false, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    // this.setMenuOpen(this.props);
    //监控路由变化
    // window.addEventListener('hashchange', () => {
    //   // this.setState({ hash: true });
    //   console.log('监听路由的变化');
    //   this.setMenuOpen(this.props);
    // });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isCollapsed) {
      this.setState({ firstHide: true });
    } else {
      this.setState({ firstHide: false });
    }
  }
  setMenuOpen = (props) => {
    const { pathname } = props.location;
    let menuUrl = pathname;
    if (pathname.includes('Add')) {
      menuUrl = pathname.substr(0, pathname.lastIndexOf('Add'));
    } else if (pathname.includes('Schedule')) {
      menuUrl = pathname.substr(0, pathname.lastIndexOf('Schedule'));
    } else if (pathname.includes('Detail')) {
      menuUrl = pathname.substr(0, pathname.lastIndexOf('Detail'));
    } else if (pathname.includes('EditUser')) {
      menuUrl = pathname.substr(0, pathname.lastIndexOf('EditUser'));
    } else if (pathname.includes('UserData')) {
      menuUrl = pathname.substr(0, pathname.lastIndexOf('UserData'));
    } else if (pathname.includes('View')) {
      menuUrl = pathname.substr(0, pathname.lastIndexOf('View'));
    } else if (pathname.includes('Edit')) {
      menuUrl = pathname.substr(0, pathname.lastIndexOf('Edit'));
    }

    this.setState({
      openKey: pathname.substr(0, pathname.lastIndexOf('/')),
      selectedKey: menuUrl,
      firstHide: false,
    });
  };
  menuClick = (e) => {
    console.log('key====' + e.key);
    this.setState({
      selectedKey: e.key,
    });
    // const { popoverHide } = this.props; // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
    // popoverHide && popoverHide();

    // this.props.history.push(e.key);
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
    console.log('===========menus');
    console.log(this.state.openKey);
    console.log(this.props.routeUrl);

    // console.log(menus);
    return (
      <Sider
        trigger={null}
        width={200}
        breakpoint="lg"
        collapsible
        collapsed={this.props.isCollapsed}
        style={{ background: 'rgb(53,64,82)', overflowY: 'auto', height: '100%', overflowX: 'hidden' }}
      >
        {/* <SiderMenu
          menus={menus}
          onClick={this.menuClick}
          mode="inline"
          selectedKeys={[this.state.selectedKey]}
          openKeys={this.state.firstHide ? null : [this.state.openKey]}
          onOpenChange={this.openMenu}
          style={{ height: '100%', borderRight: 0 }}
        /> */}
        <Menu
          mode="inline"
          onClick={this.menuClick}
          selectedKeys={[this.props.routeUrl]}
          openKeys={this.state.firstHide ? null : [this.state.openKey]}
          onOpenChange={this.openMenu}
          style={{ height: '100%', borderRight: 0 }}
        >
          {this.createMenu(menus)}
        </Menu>
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
