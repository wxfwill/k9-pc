import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Link } from 'react-router-dom'
import classNames from 'classnames'
import { Layout, Menu, Breadcrumb, Icon ,Row , Col ,Badge} from 'antd';
import Routes from 'router/routes/adminRoute';
import httpAjax from 'libs/httpAjax';
import BeardComponent from 'components/admin/common/BeardComponent'
import * as loginStatus from 'actions/loginStatus';
import SliderCustom from './SliderCustom';
import { menus } from './menus';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

require('style/index.less');
const logoPic = require('images/logo.png');

class MainComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
    };
    this.websocket = null;
  }
  componentDidMount() {
  }
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  toggle(){
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    let { location } = this.props;
    return (
    <Layout className={classNames('indexComponent')} style={{height:'100%'}} >
    <Header className="header">
      <div className="logo">
        <Row
          align='middle'
          type="flex" 
          justify="space-between"
        >
          <Col span={18} >
            <img width="40" src={util.constant.LogoSrc} alt="logo"/>
            <span style={{color:'#fff',fontSize:'18px',fontWeight:'bold',marginLeft:'20px'}}>{util.constant.logoText}</span>
          </Col>
          <Col>
            <Menu
              mode="horizontal"
              className={classNames('usermsg')}
            > 
              <Menu.Item key="notification">
                <Link to="/todo"><Badge  count={6}><Icon type="notification" /></Badge></Link>
              </Menu.Item>
              <SubMenu title={<span> <Icon type="user" />Bear熊</span>}>
                <Menu.Item key="profile">
                  <Link to="/profile">资料</Link>
                </Menu.Item>
                <Menu.Item key="logout">
                  <Icon type="poweroff" />
                  注销
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Col>
        </Row>
        
        
      </div>
    </Header>
    <Layout>
      <div>
        <SliderCustom collapsed={this.state.collapsed} menus={menus}/>
      </div>
      <Layout style={{ padding: '0 24px 24px' }}>
        <BeardComponent location={location} menus={menus}/>
        <Content style={{ background: '#fff', padding: 24, margin: 0}}>
          <Routes/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            {util.constant.footerText}
        </Footer>
      </Layout>
    </Layout>
  </Layout>
    );
  }
}

const mapStateToProps = state => ({
  loginState: state.login
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(loginStatus, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainComponent)






/* <Sider 
          width={200}
          style={{ background: '#fff' ,height:'100%',overflowY:'auto',height:'100%',overflowX:'hidden'}}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          trigger={null}
          >
          <Menu
            mode="inline"
            theme='light'
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
          <Menu.Item key="1">
              <Link to="/app/dashboard">
                <Icon type="pie-chart" />
                <span>Option</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/app/example">
                <Icon type="desktop" />
                <span>Option 3</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>User</span></span>}
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
              <Menu.Item key="6">Alex</Menu.Item>
              <Menu.Item key="33">Alex</Menu.Item>
              <Menu.Item key="34">Alex</Menu.Item>
              <Menu.Item key="35">Alex</Menu.Item>
              <Menu.Item key="36">Alex</Menu.Item>
              <Menu.Item key="37">Alex</Menu.Item>
              <Menu.Item key="38">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>Team</span></span>}
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
        </Menu>
      </Sider>*/