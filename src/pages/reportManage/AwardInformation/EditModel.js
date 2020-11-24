import React, { Component } from 'react';
import { Modal, Button, DatePicker, Select, Row, Col, Form, Input } from 'antd';
import { editModel } from 'util/Layout';
import moment from 'moment';
const { TextArea } = Input;
const Option = Select.Option;

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userName: undefined,
      completeDate: null,
      reason: undefined,
      particulars: undefined,
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

  openModel = (row) => {
    // React.$ajax.postData('/api/reward/getRewardSyncInfo', { id }).then((res) => {
    //   if (res && res.code == 0) {
    //     this.setState({ visible: true });
    //     console.log('res');
    //     console.log(res);
    //   }
    // });
    console.log('row');
    console.log(row);
    let { userName, completeDate, reason, particulars, id } = row;
    this.setState({ userName, completeDate: moment(completeDate), reason, id, particulars, visible: true });
  };
  handleOk = () => {
    console.log('ok');
    this.props.form.validateFields((err, val) => {
      console.log(val);
      val.completeDate = moment(val.completeDate).format('YYYY-MM-DD');
      let obj = Object.assign({}, val, { id: this.state.id });
      this.props.editFormData && this.props.editFormData(obj);
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
        <Form {...editModel}>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="姓名">
                {getFieldDecorator('userName', {
                  initialValue: this.state.userName,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="完成时间">
                {getFieldDecorator('completeDate', {
                  initialValue: this.state.completeDate,
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
                {getFieldDecorator('reason', {
                  initialValue: this.state.reason,
                })(<Input placeholder="请输入" style={{ width: '460px' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="详细情况">
                {getFieldDecorator('particulars', {
                  initialValue: this.state.particulars,
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
