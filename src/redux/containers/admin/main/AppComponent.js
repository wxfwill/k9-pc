import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Link } from 'react-router-dom'
import classNames from 'classnames'
import { Layout, Menu, Breadcrumb, Icon ,Row , Col ,Badge ,BackTop} from 'antd';
import Routes from 'router/routes/adminRoute';
import httpAjax from 'libs/httpAjax';
import * as loginStatus from 'actions/loginStatus';
import * as systomState from 'actions/systomStatus';
import SliderCustom from './SliderCustom';

import BeardComponent from 'components/admin/common/BeardComponent';
import HeaderComponent from 'components/admin/common/HeaderComponent';

const { Content, Footer, Sider } = Layout;
require('style/index.less');
const logoPic = require('images/logo.png');

class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
    };
    this.menus = JSON.parse(sessionStorage.getItem('menus'));
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  toggleCollapsed = () => {
    let { unfold } = this.props.systomActions;
    let { collapsed } = this.props.systomState;
    unfold(!collapsed);
  }
  render(){
    const { location,history } = this.props;
    let { collapsed } = this.props.systomState;
    let headerMsg = {
      logoSrc:util.constant.LogoSrc,
      logoText:util.constant.logoText
    }
    return (
    <Layout className={classNames('indexComponent')} style={{height:'100%'}} >
    <HeaderComponent headerMsg={headerMsg} loginState={this.user} toggleCollapsed={this.toggleCollapsed} collapsed={ collapsed }/>
    <Layout>
      <div>
        <SliderCustom collapsed={collapsed} menus={this.menus}/>
      </div>
      <Layout style={{ padding: '0 24px 24px' }} id="mainWrapper">
        <BeardComponent location={location} menus={this.menus} history={history}/>
        <Content style={{ background: '#f0f2f5',margin: 0}}>
          <Routes/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            {util.constant.footerText}
        </Footer>      
       </Layout>
    </Layout>
    <BackTop target={() => document.getElementById('mainWrapper')}visibilityHeight={200} />
  </Layout>
    );
  }
}

const mapStateToProps = state => ({
  loginState: state.login,
  systomState:state.system
})
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(loginStatus,dispatch),
    systomActions: bindActionCreators(systomState,dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent)
