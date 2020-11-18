import React, { Component } from 'react';
import { Modal, Radio, DatePicker, Select, Row, Col, Form, Input } from 'antd';
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
  hangdleFeedback = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Modal
        wrapClassName="customModel"
        title="编辑"
        visible={this.state.visible}
        width={'56%'}
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
                })(<Input placeholder="请输入" allowClear />)}
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
              <Form.Item label="任务时间">
                {getFieldDecorator('taskTime', {
                  initialValue: startValue,
                })(
                  <DatePicker
                    // disabledDate={this.disabledStartDate}
                    style={{ width: '100%' }}
                    allowClear
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="任务时间"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="是否填报">
                {getFieldDecorator('fill', {
                  initialValue: endValue,
                })(
                  <Radio.Group onChange={this.hangdleFeedback}>
                    <Radio value={true}>已填报</Radio>
                    <Radio value={false}>未填报</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="用车审核人">
                {getFieldDecorator('approval', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="地点">
                {getFieldDecorator('address', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="抓捕人数">
                {getFieldDecorator('arrest', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="派发任务领导">
                {getFieldDecorator('leader', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="上报详情">
                {getFieldDecorator('reportDetal', {
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
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="反馈详情">
                {getFieldDecorator('feedback', {
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
        </Form>
      </Modal>
    );
  }
}

const EditForm = Form.create({ name: 'EditModel' })(ShowModel);

export default EditForm;
