import React, { Component } from 'react';
import { Form, Input, TreeSelect, Select, Modal, message } from 'antd';
const FormItem = Form.Item;
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.newPassWord !== values.newPassWords) {
          message.error('两次密码输入不一致，请重新输入！');
          return;
        }
        React.$ajax
          .postData('/api/userCenter/updatePassword', {
            newPassWord: values.newPassWord,
            oldPassWord: values.oldPassWord,
          })
          .then((res) => {
            if (res && res.code == 0) {
              message.success('修改密码成功，请重新登录！');
              this.props.handleCancel();
            }
          });
      }
    });
  };

  handleCancel = (e) => {
    e.preventDefault();
    this.props.handleCancel();
    this.props.form.resetFields();
  };
  onSubmit = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改密码" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <Form onSubmit={this.onSubmit}>
          <FormItem label="原始密码">
            {getFieldDecorator('oldPassWord', {
              rules: [{ required: true, message: '请输入原始密码!' }],
              initialValue: undefined,
            })(<Input type="password" placeholder="请输入原始密码" allowClear />)}
          </FormItem>
          <FormItem label="新密码">
            {getFieldDecorator('newPassWord', {
              rules: [
                { required: true, message: '请输入新密码!' },
                {
                  pattern: util.passeordReg,
                  message: '密码是由数字和大小写字母6-18位组成',
                },
              ],
              initialValue: undefined,
            })(<Input type="password" placeholder="请输入新密码" allowClear />)}
          </FormItem>
          <FormItem label="确认密码">
            {getFieldDecorator('newPassWords', {
              rules: [{ required: true, message: '请确认新密码!' }],
              initialValue: undefined,
            })(<Input type="password" placeholder="请确认新密码" allowClear />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const ChangePasswords = Form.create()(ChangePassword);
export default ChangePasswords;
