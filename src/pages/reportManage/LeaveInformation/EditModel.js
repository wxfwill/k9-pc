import React, { Component } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { editModel } from 'util/Layout';

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  openModel = () => {
    this.setState({ visible: true });
  };
  handleOk = () => {
    console.log('ok');
    this.props.form.validateFields((err, val) => {
      console.log(val);
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleSubmit = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="编辑" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <Form onSubmit={this.handleSubmit} {...editModel}>
          <Form.Item label="标题">
            {getFieldDecorator('title', {
              initialValue: undefined,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="姓名">
            {getFieldDecorator('name', {
              initialValue: undefined,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="地址">
            {getFieldDecorator('addrem', {
              initialValue: undefined,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('mark', {
              initialValue: undefined,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          {/* <Form.Item {...tailFormItemLayout}>
            <Button htmlType="submit">确定</Button>
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}

const EditForm = Form.create({ name: 'EditModel' })(ShowModel);

export default EditForm;
