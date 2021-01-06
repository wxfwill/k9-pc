import React, {Component} from 'react';
import {Modal, InputNumber, DatePicker, Select, Row, Col, Form, Input} from 'antd';
import {editModel} from 'util/Layout';
import moment from 'moment';
const {TextArea} = Input;
const Option = Select.Option;

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      startDate: null,
      endDate: null,
      endOpen: false,
      userName: undefined,
      leaveType: undefined,
      leaveTime: undefined,
      startDate: null,
      endDate: null,
      destination: undefined,
      reason: undefined
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  disabledStartDate = (startDate) => {
    const {endDate} = this.state;
    if (!startDate || !endDate) {
      return false;
    }
    return startDate.valueOf() > endDate.valueOf();
  };

  disabledEndDate = (endDate) => {
    const {startDate} = this.state;
    if (!endDate || !startDate) {
      return false;
    }
    return endDate.valueOf() <= startDate.valueOf();
  };
  onChange = (field, value, callback) => {
    this.setState(
      {
        [field]: value
      },
      () => {
        return callback && callback();
      }
    );
  };

  onStartChange = (value) => {
    this.onChange('startDate', value, () => {
      const {startDate, endDate} = this.state;
      if (endDate && startDate) {
        const time = util.getStartEndHours(startDate, endDate);
        this.setState({leaveTime: Number(time).toFixed(1)});
      }
    });
  };

  onEndChange = (value) => {
    this.onChange('endDate', value, () => {
      const {startDate, endDate} = this.state;
      if (startDate && endDate) {
        const time = util.getStartEndHours(startDate, endDate);
        this.setState({leaveTime: Number(time).toFixed(1)});
      }
    });
  };
  handleStartOpenChange = (open) => {
    // if (!open) {
    //   this.setState({ endOpen: true });
    // }
  };

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open});
  };

  openModel = (id) => {
    React.$ajax.postData('/api/leaveAfterSync/getLeaveAfterSyncInfo', {id}).then((res) => {
      if (res && res.code == 0) {
        this.setState({visible: true});
        const resData = res.data;
        const {reason, destination, userName, leaveType, startDate, endDate, leaveHours} = resData;
        const long = Number(leaveHours) * 1000;
        this.setState({
          reason,
          destination,
          userName,
          leaveType,
          leaveTime: Number(leaveHours),
          // leaveTime: Number(moment.duration(long).asHours()),
          startDate: moment(startDate),
          endDate: moment(endDate)
        });
      }
    });
  };
  handleOk = () => {
    this.props.form.validateFields((err, val) => {
      if (!err) {
        this.props.editFormData && this.props.editFormData(val);
      }
    });
  };
  handleCancel = () => {
    this.setState({visible: false});
    this.props.form.resetFields();
  };
  selectTaskType = () => {};
  handleSubmit = () => {};
  onChangeTextArea = () => {};
  onChangeLeaveTime = () => {};
  render() {
    const {getFieldDecorator} = this.props.form;
    const {startDate, endDate, endOpen} = this.state;
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
        onCancel={this.handleCancel}>
        <Form onSubmit={this.handleSubmit} {...editModel}>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="请假人">
                {getFieldDecorator('userName', {
                  initialValue: this.state.userName
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="请假类型">
                {getFieldDecorator('leaveType', {
                  initialValue: this.state.leaveType
                })(
                  <Select placeholder="请选择" style={{width: '100%'}} allowClear onChange={this.selectTaskType}>
                    {this.props.leaveType.map((item) => {
                      return (
                        <Option key={item.id} value={item.ruleName}>
                          {item.ruleName}
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
                {getFieldDecorator('startDate', {
                  initialValue: this.state.startDate,
                  rules: [
                    {
                      required: true,
                      message: '请选择开始时间'
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={this.disabledStartDate}
                    style={{width: '100%'}}
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
                {getFieldDecorator('endDate', {
                  initialValue: this.state.endDate,
                  rules: [
                    {
                      required: true,
                      message: '请选择结束时间'
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime
                    style={{width: '100%'}}
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
              <Form.Item label="请假时长(h)">
                {getFieldDecorator('leaveTime', {
                  initialValue: this.state.leaveTime
                })(
                  <InputNumber
                    placeholder="请输入"
                    style={{width: '460px'}}
                    min={0}
                    max={10000}
                    step={0.1}
                    onChange={this.onChangeLeaveTime}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="请假目的地">
                {getFieldDecorator('destination', {
                  initialValue: this.state.destination
                })(<Input placeholder="请输入" style={{width: '460px'}} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="请假事由">
                {getFieldDecorator('reason', {
                  initialValue: this.state.reason
                })(
                  <TextArea
                    placeholder="请输入"
                    allowClear
                    style={{width: '460px'}}
                    autoSize={{minRows: 2, maxRows: 6}}
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

const EditForm = Form.create({name: 'EditModel'})(ShowModel);

export default EditForm;
