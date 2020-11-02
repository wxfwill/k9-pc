import React, { Component } from 'react';
import { Row, Col, Card, Radio, Form, Input, Select, Button, Icon, Tooltip, message, DatePicker } from 'antd';
import { firstLayout, secondLayout } from 'util/Layout';
import OrgModal from './OrgModal';
import PeoModal from './PeoModal';
import MapModal from './MapModal';
import httpAjax from 'libs/httpAjax';
import Moment from 'moment';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const combatTypeObj = { 1: '反恐处突', 2: '突发事件', 3: '侦查破案', 4: ' 重点安保' };
const combatTypeList = [
  { num: 1, text: '反恐处突' },
  { num: 2, text: '突发事件' },
  { num: 3, text: '侦查破案' },
  { num: 4, text: '重点安保' },
];

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '123',
      orgVisible: false,
      peoVisible: false,
      peoValue: '请添加作战人员',
      targetKeys: [], //保存作战人员key
      changeLeft: false, //是否显示地图
      startDateStr: '',
      selectTime: '',
      combatType: '',
    };
  }
  componentDidMount() {
    if (this.props.location.query) {
      const id = this.props.location.query.id;
      httpAjax('post', config.apiUrl + 'api/cmdMonitor/emergencyDeploymentPlanInfo', { id }).then((res) => {
        if (res.code == 0) {
          this.setState({
            ...res.data,
            targetKeys: (res.data.userIds && res.data.userIds.split(',').map((t) => Number(t))) || [],
            peoValue: res.data.userNames,
          });
          // debugger;
        }
      });
    }
  }
  handleSubmit = (type) => {
    let { history } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { subCoord, targetKeys, drawShapeDTO, startDateStr, combatType } = this.state;

        delete drawShapeDTO.latLngArr;

        let subData = {
          taskName: values.taskName,
          // latitude:subCoord.lat,
          // longitude:subCoord.lng,
          taskContent: values.taskContent,
          combatType: combatType,
          // taskType:1||parseInt(values.taskType),
          userIds: targetKeys.join(','),
          location: values.taskCoord,
          drawShapeDTO: drawShapeDTO,
          startDateStr,
        };
        if (this.props.location.query) {
          const id = this.props.location.query.id;
          subData.id = id;
        }
        const apiType = type == 'save' ? 'saveEmergencyDeploymentPlan' : 'publishEmergencyDeploymentPlan';
        httpAjax('post', config.apiUrl + `/api/cmdMonitor/${apiType}`, { ...subData }).then((res) => {
          if (res.code == 0) {
            if (type == 'save') {
              message.success('保存成功！');
            } else {
              message.success('发布成功！页面即将跳转...', 2, function () {
                history.push({ pathname: '/app/monitoring/deploy' });
              });
            }
          } else {
            message.error('系统错误！请重试...');
          }
        });
      }
    });
  };

  handleReset = () => {
    this.setState({
      peoValue: '',
    });
    this.props.form.resetFields();
  };
  handleCreate = () => {
    const form = this.orgForm;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ orgVisible: false });
    });
  };
  handleAdd(peopleMsg) {
    let values = [];
    let targetKeys = [];
    peopleMsg.forEach((item, index) => {
      values.push(item.name);
      targetKeys.push(item.key);
    });
    this.props.form.setFieldsValue({
      userIds: values.join(','),
    });
    this.setState({
      peoValue: values.join(','),
      targetKeys: targetKeys,
    });
    this.setState({ peoVisible: false });
  }
  handleCoo = () => {
    const form = this.cooForm;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ changeLeft: false });
    });
  };
  handleCancel = (e) => {
    this.setState({
      orgVisible: false,
      peoVisible: false,
      changeLeft: false,
    });
  };
  addOrg() {
    this.setState({ orgVisible: true });
    this.props.form.setFieldsValue({
      taskOrigin: this.state.value,
    });
  }
  addPeople() {
    this.setState({ peoVisible: true });
  }
  addCoord() {
    this.setState({ changeLeft: true });
  }
  handleShow(addressMsg) {
    let _this = this;
    this.setState(
      {
        changeLeft: false,
      },
      function () {
        if (typeof addressMsg != 'undefined') {
          let { subCoord, address, drawShapeDTO } = addressMsg;
          _this.setState(
            {
              subCoord: subCoord,
              drawShapeDTO: drawShapeDTO,
            },
            function () {
              _this.props.form.setFieldsValue({
                taskCoord: address,
              });
            }
          );
        }
      }
    );
  }
  orgFormRef = (form) => {
    this.orgForm = form;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { taskName, location, userIds, combatType, taskContent, startDateStr } = this.state;
    return (
      <div className="AddTask">
        <Row gutter={24}>
          <Col span={24}>
            <Card title="新增调配任务" bordered={true}>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'任务名称'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('taskName', {
                          rules: [{ required: true, message: '请输入任务名称' }],
                          initialValue: taskName || '',
                        })(<Input placeholder="任务名称" />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      {
                        //   <FormItem label={'任务来源'} {...secondLayout}>
                        //   {getFieldDecorator('taskOrigin')(
                        //       <Input placeholder="任务来源" disabled={true} addonBefore={<Icon type="plus" style={{cursor:'pointer'}} onClick={this.addOrg.bind(this)}/>}/>
                        //    )}
                        //  </FormItem>
                      }
                      <FormItem label={'作战区域'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('taskCoord', {
                          rules: [{ required: true, message: '请选择作战区域' }],
                          initialValue: location || '',
                        })(
                          <Input
                            placeholder="作战区域"
                            disabled={true}
                            addonBefore={
                              <Icon type="plus" style={{ cursor: 'pointer' }} onClick={this.addCoord.bind(this)} />
                            }
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'作战人员'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('userIds', {
                          rules: [{ required: true, message: '请添加作战人员' }],
                          initialValue: this.state.peoValue || '',
                        })(
                          <Tooltip
                            trigger={['hover']}
                            title={this.state.peoValue}
                            placement="topLeft"
                            overlayClassName="numeric-input"
                          >
                            <Input
                              placeholder="作战人员"
                              value={this.state.peoValue}
                              disabled={true}
                              addonBefore={
                                <Icon type="plus" style={{ cursor: 'pointer' }} onClick={this.addPeople.bind(this)} />
                              }
                            />
                          </Tooltip>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'作战类型'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('combatType', {
                          rules: [{ required: true, message: '请选择作战类型' }],
                          initialValue: (combatType && combatTypeObj[combatType]) || '',
                        })(
                          <Select
                            placeholder="作战类型"
                            onChange={(value) => {
                              this.setState({ combatType: value });
                            }}
                          >
                            {combatTypeList.map((item) => (
                              <Option key={item.num} value={item.num}>
                                {item.text}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'选择日期'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('startDateStr', {
                          rules: [{ required: true, message: '请选择日期' }],
                          initialValue: startDateStr ? Moment(startDateStr) : '',
                        })(
                          <DatePicker
                            format="YYYY-MM-DD"
                            onChange={(value, dateString) => {
                              this.setState({ startDateStr: dateString });
                            }}
                            disabledDate={(current) => current && current.isBefore(new Date())}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      {/*  <FormItem label={'任务类型'} {...secondLayout} hasFeedback>
                         {getFieldDecorator('taskType',{
                          rules: [{ required: true, message: '请选择任务类型' }],
                        }
                        )(
                          <Select placeholder="任务类型">
                            <Option value="1">紧急调配</Option>
                            <Option value="2">网格化搜捕</Option>
                          </Select>
                        )}
                      </FormItem>  */}
                    </Col>
                  </Row>
                  <FormItem label={'作战内容'} {...firstLayout} hasFeedback>
                    {getFieldDecorator('taskContent', {
                      rules: [{ required: true, message: '请输入作战内容' }],
                      initialValue: taskContent || '',
                    })(<TextArea placeholder="作战内容" autosize={{ minRows: 3, maxRows: 6 }} />)}
                  </FormItem>
                  <Row>
                    <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                      <Button type="primary" onClick={() => this.handleSubmit('save')}>
                        保存
                      </Button>
                      <Button type="primary" style={{ marginLeft: 8 }} onClick={() => this.handleSubmit('publish')}>
                        发布
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                        清空
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Card>
          </Col>
        </Row>
        <OrgModal
          ref={this.orgFormRef}
          visible={this.state.orgVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
        {this.state.peoVisible ? (
          <PeoModal
            visible={this.state.peoVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleAdd.bind(this)}
            targetKeys={this.state.targetKeys}
          />
        ) : null}
        {this.state.changeLeft ? (
          <MapModal
            changeLeft={this.state.changeLeft}
            handleShow={this.handleShow.bind(this)}
            onCancel={this.handleCancel}
            onCreate={this.handleCoo}
          />
        ) : null}
      </div>
    );
  }
}
const AddTask = Form.create()(AddForm);

export default AddTask;
