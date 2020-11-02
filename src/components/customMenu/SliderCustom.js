/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import SiderMenu from './SiderMenu';

const { Sider } = Layout;

class SliderCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mode: 'inline',
      openKey: '',
      selectedKey: '',
      firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
  }
  componentDidMount() {
    this.setMenuOpen(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.onCollapse(nextProps.collapsed);
    //   this.setMenuOpen(nextProps)
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
    console.log(pathname);
    console.log(pathname.substr(0, pathname.lastIndexOf('/')));
    this.setState({
      openKey: pathname.substr(0, pathname.lastIndexOf('/')),
      selectedKey: menuUrl,
      firstHide: false,
    });
  };
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      firstHide: collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  };
  menuClick = (e) => {
    this.setState({
      selectedKey: e.key,
    });
    const { popoverHide } = this.props; // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
    popoverHide && popoverHide();
  };
  openMenu = (v) => {
    this.setState({
      openKey: v[v.length - 1],
      firstHide: false,
    });
  };
  render() {
    const { menus, collapsed } = this.props;
    return (
      <Sider
        trigger={null}
        width={200}
        breakpoint="lg"
        collapsed={collapsed}
        style={{ background: 'rgb(53,64,82)', overflowY: 'auto', height: '100%', overflowX: 'hidden' }}
      >
        <SiderMenu
          menus={menus}
          onClick={this.menuClick}
          mode="inline"
          // theme='dark'
          selectedKeys={[this.state.selectedKey]}
          openKeys={this.state.firstHide ? null : [this.state.openKey]}
          onOpenChange={this.openMenu}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
    );
  }
}

export default withRouter(SliderCustom);
