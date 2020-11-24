import React, { Component } from 'react';
import { Modal, Radio, DatePicker, TreeSelect, Select, Row, Col, Form, Input } from 'antd';
import { editModel } from 'util/Layout';
import moment from 'moment';
const { TextArea } = Input;
const Option = Select.Option;
const { TreeNode } = TreeSelect;
class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      startValue: null,
      endValue: null,
      endOpen: false,
      personnelTree: [],
      id: 0,
      rep: undefined, // 申请人
      peer: undefined, // 同行人
      category: undefined, // 任务类型
      repTime: null, //任务时间
      carUseAuditor: undefined, // 用车审核人
      arrestNum: undefined, // 抓捕人数
      taskAssignLeader: undefined, // 派发任务领导
      taskLocation: undefined, // 地点
      repDetail: undefined, // 上报详情
      feedbackContext: undefined, // 反馈详情
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
  setUser = (key, data) => {
    let arr = [];
    data.map((item) => {
      arr.push(item.id);
    });
    this.setState({ [key]: arr });
  };
  getCarInfo = (repId) => {
    React.$ajax.getData('/api/report/getCarUseDetail', { repId }).then((res) => {
      if (res && res.code == 0) {
        this.setState({ visible: true });
        let resData = res.data;
        console.log(resData);
        let { arrestNum, category, repTime, taskLocation, repDetail, feedbackContext, users } = resData;
        if (users) {
          for (let key in users) {
            this.setUser(key, users[key]);
          }
        }
        this.setState({ arrestNum, taskLocation, repTime: moment(repTime), repDetail, feedbackContext });
      }
    });
  };
  openModel = (id) => {
    this.setState({ id });
    this.getCarInfo(id);
  };
  handleOk = () => {
    console.log('ok');
    this.props.form.validateFields((err, val) => {
      let obj = {};
      let {
        rep,
        peer,
        category,
        repTime,
        carUseAuditor,
        arrestNum,
        taskAssignLeader,
        taskLocation,
        repDetail,
        feedbackContext,
      } = val;
      let users = {
        rep: rep ? [Number(rep)] : null,
        peer,
        carUseAuditor,
        taskAssignLeader: taskAssignLeader ? [Number(taskAssignLeader)] : null,
      };
      obj.id = this.state.id;
      obj.users = users;
      obj.category = category ? [Number(category)] : null;
      obj.arrestNum = arrestNum ? arrestNum : null;
      obj.taskLocation = taskLocation ? taskLocation : null;
      obj.repDetail = repDetail ? repDetail : null;
      obj.feedbackContext = feedbackContext ? feedbackContext : null;
      obj.repTime = repTime ? moment(repTime).format('x') : null;
      console.log(obj);

      this.props.editFormData && this.props.editFormData(obj);
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  };
  selectTaskType = () => {};
  handleSubmit = () => {};
  handleApproval = () => {};
  onChangeTextArea = () => {};
  hangdleFeedback = () => {};
  handleTaskName = () => {};
  handleTreeName = (val) => {
    console.log(val);
    // const { setFieldsValue } = this.props.form;
    // setFieldsValue({ name: val });
    // console.log('model');
  };
  handleTreeName1 = (val, label, extra) => {
    console.log(val);
  };
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
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
              <Form.Item label="申请人">
                {getFieldDecorator('rep', {
                  initialValue: this.state.rep,
                })(
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    filterTreeNode={() => true}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    onSearch={(value) => {
                      const { setFieldsValue, getFieldValue } = this.props.form;
                      setFieldsValue({ name: undefined });
                      this.props.queryGroupUser && this.props.queryGroupUser(value, 'name');
                    }}
                    onChange={this.handleTreeName}
                  >
                    {this.props.personnelTree && this.props.personnelTree.length > 0
                      ? this.props.personnelTree.map((item) => {
                          return (
                            <TreeNode value={item.name} title={item.name} key={item.name} selectable={false}>
                              {item.children && item.children.length > 0
                                ? item.children.map((el) => {
                                    return <TreeNode value={el.id} title={el.name} key={el.name} />;
                                  })
                                : null}
                            </TreeNode>
                          );
                        })
                      : null}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="同行人">
                {getFieldDecorator('peer', {
                  initialValue: this.state.peer,
                })(
                  <TreeSelect
                    treeCheckable={true}
                    style={{ width: '100%' }}
                    filterTreeNode={() => true}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    onChange={this.handleTreeName}
                  >
                    {this.props.personnelTree2 && this.props.personnelTree2.length > 0
                      ? this.props.personnelTree2.map((item) => {
                          return (
                            <TreeNode value={item.name} title={item.name} key={item.name} selectable={false}>
                              {item.children && item.children.length > 0
                                ? item.children.map((el) => {
                                    return <TreeNode value={el.id} title={el.name} key={el.id} />;
                                  })
                                : null}
                            </TreeNode>
                          );
                        })
                      : null}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="任务类型">
                {getFieldDecorator('category', {
                  initialValue: this.state.category,
                })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    filterTreeNode={() => true}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    onChange={this.handleTaskName}
                  >
                    {this.props.taskTypeList && this.props.taskTypeList.length > 0
                      ? this.props.taskTypeList.map((item) => {
                          return (
                            <TreeNode value={item.id} title={item.ruleName} key={item.ruleName} selectable={false}>
                              {item.children && item.children.length > 0
                                ? item.children.map((el) => {
                                    return <TreeNode value={el.id} title={el.ruleName} key={el.id} />;
                                  })
                                : null}
                            </TreeNode>
                          );
                        })
                      : null}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="任务时间">
                {getFieldDecorator('repTime', {
                  initialValue: this.state.repTime,
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
          </Row>
          <Row gutter={24}>
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
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="用车审核人">
                {getFieldDecorator('carUseAuditor', {
                  initialValue: this.state.carUseAuditor,
                })(
                  <TreeSelect
                    treeCheckable={true}
                    style={{ width: '100%' }}
                    filterTreeNode={() => true}
                    // getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    onChange={this.handleApproval}
                  >
                    {this.props.personnelTree2 && this.props.personnelTree2.length > 0
                      ? this.props.personnelTree2.map((item) => {
                          return (
                            <TreeNode value={item.name} title={item.name} key={item.name} selectable={false}>
                              {item.children && item.children.length > 0
                                ? item.children.map((el) => {
                                    return <TreeNode value={el.id} title={el.name} key={el.id} />;
                                  })
                                : null}
                            </TreeNode>
                          );
                        })
                      : null}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="抓捕人数">
                {getFieldDecorator('arrestNum', {
                  initialValue: this.state.arrestNum,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="派发任务领导">
                {getFieldDecorator('taskAssignLeader', {
                  initialValue: this.state.taskAssignLeader,
                })(
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    filterTreeNode={() => true}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    onSearch={(value) => {
                      const { setFieldsValue, getFieldValue } = this.props.form;
                      setFieldsValue({ leader: undefined });
                      this.props.queryGroupUser && this.props.queryGroupUser(value, 'leader');
                    }}
                    onChange={this.handleTreeName1}
                  >
                    {this.props.personnelTree1 && this.props.personnelTree1.length > 0
                      ? this.props.personnelTree1.map((item) => {
                          return (
                            <TreeNode value={item.name} title={item.name} key={item.name} selectable={false}>
                              {item.children && item.children.length > 0
                                ? item.children.map((el) => {
                                    return <TreeNode value={el.id} title={el.name} key={el.id} />;
                                  })
                                : null}
                            </TreeNode>
                          );
                        })
                      : null}
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="地点">
                {getFieldDecorator('taskLocation', {
                  initialValue: this.state.taskLocation,
                })(<Input placeholder="请输入" allowClear style={{ width: '460px' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <Form.Item label="上报详情">
                {getFieldDecorator('repDetail', {
                  initialValue: this.state.repDetail,
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
                {getFieldDecorator('feedbackContext', {
                  initialValue: this.state.feedbackContext,
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
