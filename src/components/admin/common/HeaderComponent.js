import React, {Component} from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Link, withRouter} from 'react-router-dom';
import {Layout, Menu, Icon, Row, Col, Badge, Button, message} from 'antd';
import * as systomStatus from 'actions/systomStatus';

import httpAjax from 'libs/httpAjax';
import {constant} from 'libs/util/index';
const {Header} = Layout;
const SubMenu = Menu.SubMenu;

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
  }
  componentWillMount() {
    this.props.sysActions.newSocket();
    this.timer = setInterval(this.openWebsocket, 30000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    systomStatus.closeSocket();
  }
  componentWillReceiveProps(nextProps) {
    const socketMsg = nextProps.socketMsg;
    if (socketMsg && socketMsg.msgType == 'msgTips') {
      const data = socketMsg.data;
      this.totalMsgNum = 0;
      this.msgList = data.map((item) => {
        if (item.type < 3) {
          this.totalMsgNum += item.number;
          return (
            <Menu.Item key="logout" key={item.type}>
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
  clearMsg = (typeId) => {
    httpAjax('post', config.apiUrl + '/api/msgTips/clearMsg', {type: typeId}).then(() => {});
  };
  menuClick(data) {
    const {history} = this.props;
    const {item, key, keyPath} = data;
    if (key == 'logout') {
      const hide = message.loading('正在退出系统...', 0);
      httpAjax('post', config.apiUrl + '/api/userCenter/logout')
        .then((res) => {
          if (res.code == 0) {
            hide();
            //util.cookieUtil.unset('token');

            history.push('/');
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    } else {
      this.clearMsg(key);
    }
  }
  openWebsocket = () => {
    if (systomStatus.reWebsocket().readyState == 2 || systomStatus.reWebsocket().readyState == 3) {
      //	systomStatus.closeSocket();
      this.props.sysActions.newSocket();
    } else {
      systomStatus.reWebsocket().send(JSON.stringify({msgType: 'HeartBeat'}));
    }
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

  downloadApp = (obj, type) => {
    httpAjax('post', config.apiUrl + '/api/downLoad/getFileLocation?dlType=1')
      .then((res) => {
        if (res.code == 0) {
          window.location.href = '' + res.data;
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  downloadIM = (obj, type) => {
    httpAjax('post', config.apiUrl + '/api/downLoad/getFileLocation?dlType=2')
      .then((res) => {
        if (res.code == 0) {
          window.location.href = '' + res.data;
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  render() {
    const {name} = this.props.loginState;
    const {toggleCollapsed} = this.props;
    return (
      <Header className="header">
        <div className="logo">
          <Row type="flex" justify="space-between" align="middle">
            <Col xs={8} sm={10} md={12} lg={18}>
              <img src={constant.LogoPng} alt="logo" />
              <Button type="primary" className="collapsed" onClick={toggleCollapsed}>
                <Icon type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} />
              </Button>
            </Col>
            <Col xs={8} sm={8} md={6} lg={3}>
              <Menu mode="horizontal" className={classNames('usermsg')} onClick={this.menuClick.bind(this)}>
                <SubMenu
                  title={
                    <Badge count={this.totalMsgNum == 0 ? '' : this.totalMsgNum}>
                      <Icon type="notification" />
                    </Badge>
                  }>
                  {this.msgList}
                </SubMenu>
                <SubMenu
                  title={
                    <span>
                      {' '}
                      <Icon type="user" />
                      {name}
                    </span>
                  }>
                  {/* <Menu.Item key="profile">
	                  <Link to="/profile">资料</Link>
	                </Menu.Item> */}
                  <Menu.Item key="logout" onClick={this.menuClick.bind(this)}>
                    <Icon type="poweroff" />
                    注销
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Col>
            <Col xs={4} sm={3} md={3} lg={2} className="center">
              <span style={{cursor: 'pointer'}} onClick={this.downloadApp.bind(this)}>
                <Icon type="download" /> app端
              </span>
            </Col>
            <Col xs={4} sm={3} md={3} lg={1}>
              <span style={{cursor: 'pointer'}} onClick={this.downloadIM.bind(this)}>
                <Icon type="download" /> IM
              </span>
            </Col>
          </Row>
        </div>
      </Header>
    );
  }
}
const mapStateToProps = (state) => ({
  socketMsg: state.system && state.system.socketMsg
});
const mapDispatchToProps = (dispatch) => ({
  sysActions: bindActionCreators(systomStatus, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderComponent));
