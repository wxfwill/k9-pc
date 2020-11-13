import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Layout, BackTop } from 'antd';
import ReactDOM from 'react-dom';
import { showNavCollapsed, changeRoute } from 'store/actions/common';
import SliderCustom from 'components/customMenu/SliderCustom';
import CustomBreadcrumb from 'components/BeardComponent';
import HeaderComponent from 'components/HeaderComponent';

const { Content, Footer, Sider } = Layout;
require('style/index.less');

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.mainWrapper1 = React.createRef();
    this.menus = this.props.menus;
  }
  componentDidMount() {
    // let dom = ReactDOM.findDOMNode(this.mainWrapper1.current);
    // console.log(dom);
    // dom.onscroll = function (e) {
    //   console.log(e);
    //   console.log(dom.scrollTop);
    // };
    let _this = this;
    let beginTime = 0; //执行onbeforeunload的开始时间
    let differTime = 0; //时间差
    window.onunload = function () {
      differTime = new Date().getTime() - beginTime;
      if (differTime <= 3) {
        // 关闭
        _this.props.changeRouteAction('/app/home/index');
      } else {
        // 刷新
      }
    };
    window.onbeforeunload = function () {
      beginTime = new Date().getTime();
    };
  }
  componentWillUnmount() {
    window.onbeforeunload = null;
    window.onunload = null;
  }
  onRef = (ref) => {
    this.child = ref;
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.props.changeRouteAction(nextProps.location.pathname);
    }
  }
  render() {
    const { location, history } = this.props;
    return (
      <Layout className={classNames('indexComponent')} style={{ height: '100%' }}>
        <HeaderComponent />
        <Layout>
          <div>
            <SliderCustom menus={this.menus} onRef={this.onRef} isCollapsed={this.props.isCollapsed} />
          </div>
          <Layout id="mainWrapper">
            <CustomBreadcrumb arr={this.props.navData} />
            <div className="midder-content" id="mainWrapper1" ref={this.mainWrapper1}>
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
  routeUrl: state.commonReducer.routeUrl,
  menus: state.loginReducer.menuList,
});
const mapDispatchToProps = (dispatch) => ({
  isCollapsedAction: () => dispatch(showNavCollapsed()),
  changeRouteAction: (url) => dispatch(changeRoute(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainComponent));
