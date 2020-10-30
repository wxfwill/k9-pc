import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import { Button, Row, Input, Form, Checkbox, Icon, message } from 'antd';
// import {animation} from './animation.js';
import * as loginStatus from 'actions/loginStatus';
import * as systomStatus from 'actions/systomStatus';
import 'style/pages/login.less';
// const THREE = require('libs/three.js');
const FormItem = Form.Item;

const addMenu = [
  {
    icon: 'area-chart',
    id: 200,
    pathname: 'pages/reportManage',
    sub: [
      { id: 201, title: '4w报备上报', pathname: '/app/report/fourReport', icon: '' },
      { id: 202, title: '4w报备信息', pathname: '/app/report/FourReportListSearch', icon: '' },
      { id: 203, title: '4w任务统计', pathname: '/app/report/StatisticsList', icon: '' },
    ],
    title: '4w报备',
  },
];

class Login extends Component {
  constructor(props) {
    super(props);
    let localUser = JSON.parse(localStorage.getItem('username'));
    let localPwd = JSON.parse(localStorage.getItem('password'));
    let username = typeof localUser == 'object' ? ' ' : localUser;
    let password = typeof localPwd == 'object' ? '' : localPwd;
    this.state = {
      username: username,
      password: password,
      validate: false,
      loginLoading: false,
      remUser: typeof localUser == 'object' ? false : true,
      remPwd: typeof localPwd == 'object' ? false : true,
    };
  }
  componentDidMount() {
    // animation(THREE);
  }
  handleLogin(data, dispatch, handle) {
    let { history } = this.props;
    const self = this;
    handle();
    this.setState(
      {
        loginLoading: false,
      },
      function () {
        if (data.code == 0) {
          let { roleType } = data.data.user;
          let { user, menuList, msgList } = data.data;
          let newMenuList = [...menuList, ...addMenu];
          // debugger;
          dispatch(user, msgList);
          let userJson = JSON.stringify(user);
          let munuJson = JSON.stringify(newMenuList);

          sessionStorage.setItem('user', userJson);
          sessionStorage.setItem('menus', munuJson);
          message.success('登录成功！', 1, function () {
            // self.props.sysActions.newSocket();
            /*    if(roleType==0){
              history.push({pathname:'/view/home/index',menus:menuList})
            }else{
              history.push({pathname:'/app/home/index',menus:menuList})
            }  */
            history.push({ pathname: '/app/home/index', menus: newMenuList });
          });
        } else {
          message.error(data.msg, 1);
        }
      }
    );
  }
  handleChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    let _this = this;
    let { success, error } = this.props.actions;
    _this.setState({
      validate: true,
    });
    _this.props.form.validateFields((err, values) => {
      if (!err) {
        _this.setState({
          loginLoading: true,
        });
        httpAjax('post', config.apiUrl + '/api/userCenter/login', {
          account: values.userName.trim(),
          password: values.password.trim(),
        })
          .then((res) => {
            let hide = message.loading('正在验证...', 0);
            _this.handleLogin(res, success, hide);
          })
          .catch(function (err) {
            let hide = message.loading('正在验证...', 0);
            _this.handleLogin(err, error, hide);
          });
      }
    });
  }
  changeChecked(state, event) {
    let _this = this;
    if ((state == 'remPwd' && !this.state.remUser) || (state == 'remUser' && this.state.remPwd)) {
      this.setState(
        {
          remPwd: event.target.checked,
          remUser: event.target.checked,
        },
        function () {
          if (event.target.checked) {
            localStorage.setItem('username', JSON.stringify(this.state.username));
            localStorage.setItem('password', JSON.stringify(this.state.password));
          } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
          }
        }
      );
    } else {
      this.setState(
        {
          [state]: event.target.checked,
        },
        function () {
          if (_this.state.remPwd && state == 'remPwd') {
            localStorage.setItem('password', JSON.stringify(this.state.password));
          } else if (_this.state.remUser && state == 'remUser') {
            localStorage.setItem('username', JSON.stringify(this.state.username));
          } else if (!_this.state.remPwd && state == 'remPwd') {
            localStorage.removeItem('password');
          } else if (!_this.state.remUser && state == 'remUser') {
            localStorage.removeItem('username');
          }
        }
      );
    }
  }
  handleInput(target, event) {
    this.setState({
      [target]: event.target.value,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { loginState } = this.props;
    return (
      <div className="loginpage" id="loginWrapper">
        <div className="background"></div>
        <div className="card">
          <div className="logos">
            <img alt={'logo'} src={util.constant.LogoSrc} />
            <span>{util.constant.name}</span>
          </div>
          <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
            <FormItem hasFeedback={this.state.validate}>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入用户名!' }],
                initialValue: this.state.username,
              })(
                <Input
                  autoComplete="off"
                  onChange={this.handleInput.bind(this, 'username')}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                  className="username"
                />
              )}
            </FormItem>
            <FormItem hasFeedback={this.state.validate}>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
                initialValue: this.state.password,
              })(
                <Input
                  autoComplete="off"
                  onChange={this.handleInput.bind(this, 'password')}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                  className="password"
                />
              )}
            </FormItem>
            <FormItem>
              <Checkbox checked={this.state.remUser} onChange={this.changeChecked.bind(this, 'remUser')}>
                记住账号
              </Checkbox>
              <Checkbox checked={this.state.remPwd} onChange={this.changeChecked.bind(this, 'remPwd')}>
                记住密码
              </Checkbox>
            </FormItem>
            <Button
              type="primary"
              loading={this.state.loginLoading}
              htmlType="submit"
              style={{ width: '100%' }}
              className="login-form-button"
            >
              登录
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
const LoginComponent = Form.create()(Login);

const mapStateToProps = (state) => ({
  loginState: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(loginStatus, dispatch),
  sysActions: bindActionCreators(systomStatus, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);

//getValueFromEvent:this.handleInput.bind(this,'username')
