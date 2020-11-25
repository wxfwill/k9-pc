import React, { Component } from 'react';
import { Modal, Button, InputNumber, Select, Row, Col, Form, Input } from 'antd';
import { editModel } from 'util/Layout';
const Option = Select.Option;

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      startValue: null,
      endValue: null,
      endOpen: false,
      taksTypeData: [
        {
          id: 1,
          title: '测试',
        },
        {
          id: 2,
          title: 'hah',
        },
      ],
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  openModel = () => {
    this.setState({ visible: true });
  };
  handleOk = () => {
    console.log('ok');
    this.props.form.validateFields((err, val) => {
      console.log(val);
      this.props.editFormData && this.props.editFormData(val);
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  };
  selectTaskType = () => {};
  handleSubmit = () => {};
  onChangeTextArea = () => {};
  handleChangeNum = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Modal
        wrapClassName="customModel"
        title={this.props.type}
        visible={this.state.visible}
        width={'50%'}
        centered={false}
        destroyOnClose={false}
        maskClosable={false}
        okText={'保存'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleSubmit} {...editModel}>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="菜单名称">
                {getFieldDecorator('name', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="菜单URL">
                {getFieldDecorator('url', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="菜单类型">
                {getFieldDecorator('type', {
                  initialValue: undefined,
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear onChange={this.selectTaskType}>
                    {this.state.taksTypeData.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.title}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="页签标识">
                {getFieldDecorator('page', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="权限码">
                {getFieldDecorator('label', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="排序">
                {getFieldDecorator('per', {
                  initialValue: 1,
                })(<InputNumber min={1} max={100} style={{ width: '100%' }} onChange={this.handleChangeNum} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const EditForm = Form.create({ name: 'EditModel' })(ShowModel);

export default EditForm;
