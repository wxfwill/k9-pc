import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Input, Form, Checkbox, Icon, message } from 'antd';

import { saveUserInfo, saveMenuList, saveToken } from 'store/actions/loginAction';
import { changeRoute } from 'store/actions/common';

import { encodeAesString, encryptRAS } from 'util/CryptoJS';

import 'style/pages/login.less';
const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props);
    let localUser = JSON.parse(localStorage.getItem('username'));
    let localPwd = JSON.parse(localStorage.getItem('password'));
    let username = typeof localUser == 'object' ? '' : localUser;
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
    let { password } = this.state;
    if (password) {
      this.props.form.validateFields(['password']);
    }
  }
  handleChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let { history } = this.props;
    this.setState({
      validate: true,
    });
    const { remUser, remPwd, username, password } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loginLoading: true,
        });
        let hide = message.loading('正在验证...', 0);
        let users = {
          account: values.userName.trim(),
          password: values.password.trim(),
        };
        console.log(users);
        let desEncrypt = encodeAesString(JSON.stringify(users));
        let encrypt = encryptRAS();
        React.$ajax.login.postLogin({ k: encrypt, d: desEncrypt }).then((res) => {
          if (res && res.code == 0) {
            hide();
            this.setState({ loginLoading: false }, () => {
              let { user, menus, token } = res.data;
              let userJson = JSON.stringify(user);
              let munuJson = JSON.stringify(menus);
              this.props.tokenAction(token);
              this.props.menuAction(menus);
              this.props.userinfoAction(user);
              this.props.changeRouteAction('/app/index');
              sessionStorage.setItem('user', userJson);
              sessionStorage.setItem('menus', munuJson);
              message.success('登录成功！', 1, function () {
                history.push({ pathname: '/app/index', menus: menus });
              });
              //登录成功后记住账号、密码 / 清除记住的账号、密码
              remUser
                ? localStorage.setItem('username', JSON.stringify(username))
                : localStorage.removeItem('username');
              remPwd ? localStorage.setItem('password', JSON.stringify(password)) : localStorage.removeItem('password');
            });
          } else {
            this.setState({ loginLoading: false });
          }
        });
      }
    });
  };
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
                rules: [{ required: true, message: '请输入用户名或手机号!' }],
                initialValue: this.state.username,
              })(
                <Input
                  autoComplete="off"
                  onChange={this.handleInput.bind(this, 'username')}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名/手机号"
                  className="username"
                />
              )}
            </FormItem>
            <FormItem hasFeedback={this.state.validate}>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入密码!' },
                  {
                    pattern: util.passeordReg,
                    message: '密码是由数字和大小写字母6-18位组成',
                  },
                ],
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
              <Checkbox
                checked={this.state.remUser}
                onChange={this.changeChecked.bind(this, 'remUser')}
                disabled={this.state.loginLoading}
              >
                记住账号
              </Checkbox>
              <Checkbox
                checked={this.state.remPwd}
                onChange={this.changeChecked.bind(this, 'remPwd')}
                disabled={this.state.loginLoading}
              >
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
  token: state.loginReducer.token,
});

const mapDispatchToProps = (dispatch) => ({
  userinfoAction: (info) => dispatch(saveUserInfo(info)),
  tokenAction: (token) => dispatch(saveToken(token)),
  menuAction: (list) => dispatch(saveMenuList(list)),
  changeRouteAction: (url) => dispatch(changeRoute(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
