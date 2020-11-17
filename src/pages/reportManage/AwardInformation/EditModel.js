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
        title="奖励信息编辑"
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
              <Form.Item label="完成时间">
                {getFieldDecorator('satrtTime', {
                  initialValue: startValue,
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="完成时间"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="加分原因">
                {getFieldDecorator('address', {
                  initialValue: undefined,
                })(<Input placeholder="请输入" style={{ width: '460px' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="详细情况">
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
        </Form>
      </Modal>
    );
  }
}

const EditForm = Form.create({ name: 'EditModel' })(ShowModel);

export default EditForm;
