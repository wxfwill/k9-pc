import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import classNames from 'classnames';
import {Layout, BackTop} from 'antd';
import {renderRoutes} from 'react-router-config';
import {showNavCollapsed, changeRoute, changeNavName} from 'store/actions/common';
import {saveToken} from 'store/actions/loginAction';
import SliderCustom from 'components/customMenu/SliderCustom';
import CustomBreadcrumb from 'components/BeardComponent/Breadcrumbs';
import HeaderComponent from 'components/HeaderComponent';

const {Content, Footer} = Layout;
require('style/index.less');

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.mainWrapper1 = React.createRef();
    this.menus = this.props.menus;
  }
  componentDidMount() {
    const _this = this;
    let beginTime = 0; //执行onbeforeunload的开始时间
    let differTime = 0; //时间差
    window.onunload = function () {
      differTime = new Date().getTime() - beginTime;
      if (differTime <= 3) {
        // 关闭
        _this.props.socket.close();
        _this.props.changeRouteAction('/app/index');
        _this.props.tokenAction(null);
      } else {
        // 刷新
      }
    };
    window.onbeforeunload = function () {
      beginTime = new Date().getTime();
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.props.changeRouteAction(nextProps.location.pathname);
    }
  }
  componentWillUnmount() {
    window.onbeforeunload = null;
    window.onunload = null;
  }
  onRef = (ref) => {
    this.child = ref;
  };
  render() {
    const {route} = this.props;
    return (
      <Layout className={classNames('indexComponent')} style={{height: '100%'}}>
        <HeaderComponent isShowCollaps={true} />
        <Layout style={{height: 'calc(100% - 64px)'}}>
          <SliderCustom menus={this.menus} onRef={this.onRef} isCollapsed={this.props.isCollapsed} />
          <Layout id="mainWrapper">
            <CustomBreadcrumb />
            <div className="midder-content" id="mainWrapper1" style={{height: '100%'}} ref={this.mainWrapper1}>
              {/* <CustomBreadcrumb arr={this.props.navData} /> */}
              <Content style={{background: '#f0f2f5', margin: 0, padding: '0 24px 0px', height: '100%'}}>
                {/* {this.props.children} */}
                {renderRoutes(route.items)}
              </Content>
            </div>
            <BackTop target={() => document.getElementById('mainWrapper1')} visibilityHeight={200} />
            <Footer style={{textAlign: 'center', padding: '10px'}}>{util.constant.footerText}</Footer>
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
  routeUrl: state.commonReducer.routeUrl,
  menus: state.loginReducer.menuList,
  isShowGridMap: state.commonReducer.isShowGridMap,
  socket: state.commonReducer.socket
});
const mapDispatchToProps = (dispatch) => ({
  isCollapsedAction: () => dispatch(showNavCollapsed()),
  tokenAction: (token) => dispatch(saveToken(token)),
  changeRouteAction: (url) => dispatch(changeRoute(url)),
  changeNavNameAction: (bread) => dispatch(changeNavName(bread))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainComponent));
