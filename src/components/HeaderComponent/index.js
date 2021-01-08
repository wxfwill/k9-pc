import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Layout, Menu, Dropdown, Modal, Icon, Row, Col, Button, message} from 'antd';
// import * as systomStatus from 'actions/systomStatus';
import {showNavCollapsed} from 'store/actions/common';
import {saveToken} from 'store/actions/loginAction';

import {constant} from 'libs/util/index';
import {changeRoute, changeMapType} from 'store/actions/common';
import ScreenFull from '../Screenfull/index';

import ChangePassword from 'components/ChangePassword';
const {Header} = Layout;

const newMsgObj = {
  ///app/monitoring/leaveCheck
  1: {text: '请假审批', link: '/app/holiday/approve'},
  2: {text: '犬病治疗', link: '/app/dog/cure'}
  /*	3: {text: '训练任务', link: '/app/drill/pdogdrill'},
	4: {text: '日常巡逻', link: '/app/monitoring/duty'},
	5:{link:'/app/monitoring/deploy'},
	6: {text: '网格搜捕', link: '/app/monitoring/grid'},
	7: {text: '外出执勤', link:'/app/monitoring/duty'},
	8: {text: '集合点', link:''},
	9: {text:'', link:''},
	10: {text:'', link:''},
	11: {text:'', link:''}*/
};

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.msgList = '';
    this.totalMsgNum = 0;
    this.timer = null;
    this.state = {
      isShow: false
    };
  }
  UNSAFE_componentWillMount() {
    // this.props.sysActions.newSocket();
    // this.timer = setInterval(this.openWebsocket, 30000);
  }
  componentDidMount() {}
  UNSAFE_componentWillReceiveProps(nextProps) {
    const socketMsg = nextProps.socketMsg;
    if (socketMsg && socketMsg.msgType == 'msgTips') {
      const data = socketMsg.data;
      this.totalMsgNum = 0;
      this.msgList = data.map((item) => {
        if (item.type < 3) {
          this.totalMsgNum += item.number;
          return (
            <Menu.Item key={item.type}>
              <Link to={newMsgObj[item.type].link}>
                <span style={{display: 'inlineBlock', marginRight: 55}}>{item.title}</span>
                <span style={{color: 'red'}}>{item.number}</span>
              </Link>
            </Menu.Item>
          );
        }
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    // systomStatus.closeSocket();
  }
  clearMsg = (typeId) => {
    React.$ajax.postData('/api/msgTips/clearMsg', {type: typeId}).then(() => {});
  };
  menuClick(data) {
    const {history} = this.props;
    const {key} = data;
    if (key == 'logout') {
      const hide = message.loading('正在退出系统...', 0);
      React.$ajax
        .postData('/api/userCenter/logout')
        .then((res) => {
          if (res.code == 0) {
            hide();
            //util.cookieUtil.unset('token');
            this.props.changeRouteAction('/app/index');
            this.props.tokenAction(null);
            history.push('/login');
          }
        })
        .catch(function () {});
    } else {
      this.clearMsg(key);
    }
  }
  openWebsocket = () => {
    // if (systomStatus.reWebsocket().readyState == 2 || systomStatus.reWebsocket().readyState == 3) {
    //   //	systomStatus.closeSocket();
    //   this.props.sysActions.newSocket();
    // } else {
    //   systomStatus.reWebsocket().send(JSON.stringify({ msgType: 'HeartBeat' }));
    // }
  };
  renderList = () => {
    const socketMsg = this.props.socketMsg;
    if (socketMsg && socketMsg.msgType == 'msgTips') {
      const data = socketMsg.data;
      return data.map((item) => {
        return (
          <Menu.Item key="logout">
            <Link to={newMsgObj[item.type].link}>
              <span style={{display: 'inlineBlock', marginRight: 55}}>{item.title}</span>
              <span style={{color: 'red'}}>{item.number}</span>
            </Link>
          </Menu.Item>
        );
      });
    }
  };

  handleLoginOut = () => {
    Modal.confirm({
      title: '提示',
      content: '确认退出吗？',
      onOk: () => {
        const hide = message.loading('正在退出系统...', 0);
        React.$ajax.postData('/api/userCenter/logout').then((res) => {
          if (res.code == 0) {
            hide();
            this.props.changeRouteAction('/app/index');
            this.props.tokenAction(null);
            this.props.history.push('/login');
          }
        });
      },
      onCancel: () => {}
    });
  };

  downloadApp = () => {
    React.$ajax.postData('/api/downLoad/getFileLocation?dlType=1').then((res) => {
      if (res.code == 0) {
        window.location.href = '' + res.data;
      }
    });
  };
  downloadIM = () => {
    React.$ajax.postData('/api/downLoad/getFileLocation?dlType=2').then((res) => {
      if (res.code == 0) {
        window.location.href = '' + res.data;
      }
    });
  };
  handleCollapsed = () => {
    // this.props.changeMapType(false);
    this.props.isCollapsedAction();
  };
  handleDrop = ({key}) => {
    console.log(key);
    if (key == 'app') {
      this.downloadApp();
    } else if (key == 'IM') {
      this.downloadIM();
    } else if (key == 'loginOut') {
      this.handleLoginOut();
    } else if (key == 'changePassword') {
      //console.log('修改密码');
      this.setState({
        isShow: !this.state.isShow
      });
    }
  };
  dropMenu = () => {
    return (
      <Menu onClick={this.handleDrop}>
        <Menu.Item key="app">
          <span style={{cursor: 'pointer'}}>
            <Icon type="download" /> app端
          </span>
        </Menu.Item>
        <Menu.Item key="IM">
          <span style={{cursor: 'pointer'}}>
            <Icon type="download" /> IM
          </span>
        </Menu.Item>
        <Menu.Item key="changePassword">
          <span style={{cursor: 'pointer'}}>
            <Icon type="edit" /> 修改密码
          </span>
        </Menu.Item>
        <Menu.Item key="loginOut">
          <span style={{cursor: 'pointer'}}>
            <Icon type="poweroff" />
            退出系统
          </span>
        </Menu.Item>
      </Menu>
    );
  };
  //关闭修改密码弹窗
  handleCancel = (isSuccess) => {
    this.setState(
      {
        isShow: false
      },
      () => {
        isSuccess && this.props.history.push('/login'); //修改密码成功，返回登录页
      }
    );
  };
  render() {
    const {name} = this.props.userinfo;
    return (
      <Header className="header">
        <div className="logo">
          <Row type="flex" justify="space-between" align="middle">
            <Col xs={8} sm={10} md={10} lg={12}>
              <img src={constant.LogoPng} alt="logo" />
              <Button
                type="primary"
                className="collapsed"
                onClick={this.handleCollapsed.bind(this)}
                style={{display: this.props.isShowCollaps ? 'inline-block' : 'none'}}>
                <Icon type={this.props.isCollapsed ? 'menu-unfold' : 'menu-fold'} />
              </Button>
            </Col>
            {/* <Col offset={2} xs={2} sm={2} md={1} lg={1} className="center">
              <Badge count={this.totalMsgNum == 0 ? '' : this.totalMsgNum}>
                <Icon type="notification" />
              </Badge>
            </Col> */}
            <Col xs={6} sm={6} md={6} lg={6} className="center">
              <Dropdown overlay={this.dropMenu()}>
                <a
                  className="ant-dropdown-link"
                  style={{color: 'rgba(0, 0, 0, 0.65)'}}
                  onClick={(e) => e.preventDefault()}>
                  {name}
                  <Icon type="down" />
                </a>
              </Dropdown>
              <ScreenFull></ScreenFull>
            </Col>
          </Row>
        </div>
        <ChangePassword visible={this.state.isShow} handleCancel={this.handleCancel} />
      </Header>
    );
  }
}
const mapStateToProps = (state) => ({
  token: state.loginReducer.token,
  socketMsg: state.system && state.system.socketMsg,
  isCollapsed: state.commonReducer.collapsed,
  userinfo: state.loginReducer.userInfo
});
const mapDispatchToProps = (dispatch) => ({
  // sysActions: bindActionCreators(systomStatus, dispatch),
  tokenAction: (token) => dispatch(saveToken(token)),
  isCollapsedAction: () => dispatch(showNavCollapsed()),
  changeRouteAction: (url) => dispatch(changeRoute(url)),
  changeMapType: (bool) => dispatch(changeMapType(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderComponent));
