import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Badge, BackTop } from 'antd';
import * as loginStatus from 'actions/loginStatus';
import * as systomState from 'actions/systomStatus';
import SliderCustom from 'components/customMenu/SliderCustom';

import BeardComponent from 'components/BeardComponent';
import HeaderComponent from 'components/HeaderComponent';

const { Content, Footer, Sider } = Layout;
require('style/index.less');
const logoPic = require('images/logo.png');

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
    this.menus = JSON.parse(sessionStorage.getItem('menus'));
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };
  toggleCollapsed = () => {
    let { unfold } = this.props.systomActions;
    let { collapsed } = this.props.systomState;
    unfold(!collapsed);
  };
  render() {
    const { location, history } = this.props;
    let { collapsed } = this.props.systomState || false;
    let headerMsg = {
      logoSrc: util.constant.LogoSrc,
      logoText: util.constant.logoText,
    };
    return (
      <Layout className={classNames('indexComponent')} style={{ height: '100%' }}>
        <HeaderComponent
          headerMsg={headerMsg}
          loginState={this.user}
          toggleCollapsed={this.toggleCollapsed}
          collapsed={collapsed}
        />
        <Layout>
          <div>
            <SliderCustom collapsed={collapsed} menus={this.menus} />
          </div>
          <Layout id="mainWrapper">
            <BeardComponent location={location} menus={this.menus} history={history} />
            <div className="midder-content" id="mainWrapper1">
              <Content style={{ background: '#f0f2f5', margin: 0, padding: '0 24px 0px' }}>
                {/* <Routes /> */}
                {this.props.children}
              </Content>
            </div>
            <BackTop target={() => document.getElementById('mainWrapper1')} visibilityHeight={200} />
            <Footer style={{ textAlign: 'center', padding: '10px' }}>{util.constant.footerText}</Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  loginState: state.login,
  systomState: state.system,
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(loginStatus, dispatch),
  systomActions: bindActionCreators(systomState, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
