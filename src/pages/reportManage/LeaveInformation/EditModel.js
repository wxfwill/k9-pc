import React, { Component } from 'react';
import { Modal, Button, DatePicker, Select, Row, Col, Form, Input } from 'antd';
import { editModel } from 'util/Layout';
const { TextArea } = Input;
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
  disabledStartDate = (startValue) => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Modal
        wrapClassName="customModel"
        title="请假信息编辑"
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
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="姓名">
                {getFieldDecorator('name', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="类型">
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
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="开始时间">
                {getFieldDecorator('satrtTime', {
                  initialValue: startValue,
                })(
                  <DatePicker
                    // disabledDate={this.disabledStartDate}
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="开始时间"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="结束时间">
                {getFieldDecorator('endTime', {
                  initialValue: endValue,
                })(
                  <DatePicker
                    // disabledDate={this.disabledEndDate}
                    showTime
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="结束时间"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="请假目的地">
                {getFieldDecorator('address', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" style={{ width: '460px' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="请假事由">
                {getFieldDecorator('mark', {
                  initialValue: undefined,
                })(
                  <TextArea
                    placeholder="请输入"
                    allowClear
                    style={{ width: '460px' }}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    onChange={this.onChangeTextArea}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>

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
