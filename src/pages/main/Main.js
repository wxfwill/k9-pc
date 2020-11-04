import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Layout, BackTop } from 'antd';
import { showNavCollapsed } from 'store/actions/common';
import SliderCustom from 'components/customMenu/SliderCustom';
import CustomBreadcrumb from 'components/BeardComponent';
import HeaderComponent from 'components/HeaderComponent';

const { Content, Footer, Sider } = Layout;
require('style/index.less');
const logoPic = require('images/logo.png');

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.menus = this.props.menus;
    console.log('this.props====');
    console.log(this.props);
  }
  render() {
    const { location, history } = this.props;
    return (
      <Layout className={classNames('indexComponent')} style={{ height: '100%' }}>
        <HeaderComponent />
        <Layout>
          <div>
            <SliderCustom menus={this.menus} isCollapsed={this.props.isCollapsed} />
          </div>
          <Layout id="mainWrapper">
            <CustomBreadcrumb arr={this.props.navData} />
            <div className="midder-content" id="mainWrapper1">
              <Content style={{ background: '#f0f2f5', margin: 0, padding: '0 24px 0px' }}>
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
  isCollapsed: state.commonReducer.collapsed,
  navData: state.commonReducer.navData,
  menus: state.loginReducer.menuList,
});
const mapDispatchToProps = (dispatch) => ({
  isCollapsedAction: () => dispatch(showNavCollapsed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainComponent));
