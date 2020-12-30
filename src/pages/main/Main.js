import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Layout, BackTop } from 'antd';
import { renderRoutes } from 'react-router-config';
import { showNavCollapsed, changeRoute, changeNavName } from 'store/actions/common';
import SliderCustom from 'components/customMenu/SliderCustom';
import CustomBreadcrumb from 'components/BeardComponent/Breadcrumbs';
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
    console.log(this.props.isShowGridMap);
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
    // ;
    // ;
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.props.changeRouteAction(nextProps.location.pathname);
    }
  }
  getBreadcrumb = ({ flattenRoutes, curSection, pathSection }) => {
    const matchRoute = flattenRoutes.find((ele) => {
      const { breadcrumb, path } = ele;
      if (!breadcrumb || !path) {
        throw new Error('Router中的每一个route必须包含 `path` 以及 `breadcrumb` 属性');
      }
      // 查找是否有匹配
      // exact 为 react router4 的属性，用于精确匹配路由
      return matchPath(pathSection, { path, exact: true });
    });

    // 返回breadcrumb的值，没有就返回原匹配子路径名
    if (matchRoute) {
      return render({
        content: matchRoute.breadcrumb || curSection,
        path: matchRoute.path,
      });
    }

    // 对于routes表中不存在的路径
    // 根目录默认名称为首页.
    return render({
      content: pathSection === '/' ? '首页' : curSection,
      path: pathSection,
    });
  };
  getBreadcrumbs = ({ flattenRoutes, location }) => {
    // 初始化匹配数组match
    let matches = [];
    location.pathname
      // 取得路径名，然后将路径分割成每一路由部分.
      .split('?')[0]
      .split('/')
      // 对每一部分执行一次调用`getBreadcrumb()`的reduce.
      .reduce((prev, curSection) => {
        // 将最后一个路由部分与当前部分合并，比如当路径为 `/x/xx/xxx` 时，pathSection分别检查 `/x` `/x/xx` `/x/xx/xxx` 的匹配，并分别生成面包屑
        const pathSection = `${prev}/${curSection}`;
        const breadcrumb = getBreadcrumb({
          flattenRoutes,
          curSection,
          pathSection,
        });

        // 将面包屑导入到matches数组中
        matches.push(breadcrumb);

        // 传递给下一次reduce的路径部分
        return pathSection;
      });
    return matches;
  };
  flattenRoutes = (arr) =>
    arr.reduce((prev, item) => {
      // prev.push(item);
      return prev.concat(Array.isArray(item.routes) ? this.flattenRoutes(item.routes) : item);
    }, []);
  render() {
    const { route } = this.props;
    return (
      <Layout className={classNames('indexComponent')} style={{ height: '100%' }}>
        <HeaderComponent />
        <Layout style={{ height: 'calc(100% - 64px)' }}>
          <SliderCustom menus={this.menus} onRef={this.onRef} isCollapsed={this.props.isCollapsed} />
          <Layout id="mainWrapper">
            <CustomBreadcrumb />
            <div className="midder-content" id="mainWrapper1" style={{ height: '100%' }} ref={this.mainWrapper1}>
              {/* <CustomBreadcrumb arr={this.props.navData} /> */}
              <Content style={{ background: '#f0f2f5', margin: 0, padding: '0 24px 0px', height: '100%' }}>
                {/* {this.props.children} */}
                {renderRoutes(route.items)}
              </Content>
            </div>
            <BackTop target={() => document.getElementById('mainWrapper1')} visibilityHeight={200} />
            <Footer
              style={{ textAlign: 'center', padding: '10px', display: this.props.isShowGridMap ? 'none' : 'block' }}
            >
              {util.constant.footerText}
            </Footer>
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
});
const mapDispatchToProps = (dispatch) => ({
  isCollapsedAction: () => dispatch(showNavCollapsed()),
  changeRouteAction: (url) => dispatch(changeRoute(url)),
  changeNavNameAction: (bread) => dispatch(changeNavName(bread)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainComponent));
