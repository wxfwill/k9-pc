import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Layout, BackTop } from 'antd';
import { showNavCollapsed } from 'store/actions/common';
import SliderCustom from 'components/customMenu/SliderCustom';
import BeardComponent from 'components/BeardComponent';
import HeaderComponent from 'components/HeaderComponent';

const { Content, Footer, Sider } = Layout;
require('style/index.less');
const logoPic = require('images/logo.png');

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.menus = this.props.menus;
  }
  render() {
    const { location, history } = this.props;
    return (
      <Layout className={classNames('indexComponent')} style={{ height: '100%' }}>
        <HeaderComponent />
        <Layout>
          <div>
            <SliderCustom menus={this.menus} />
          </div>
          <Layout id="mainWrapper">
            <BeardComponent location={location} menus={this.menus} history={history} />
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
  menus: state.loginReducer.menuList,
});
const mapDispatchToProps = (dispatch) => ({
  isCollapsedAction: () => dispatch(showNavCollapsed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainComponent));
