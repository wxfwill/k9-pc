import React, { Component } from 'react';
import { Button, Icon, message, Card, Row, Col, DatePicker, Form, Input, Tooltip, Select } from 'antd';
import httpAjax from 'libs/httpAjax';
import { firstLayout } from 'util/Layout';
import PeoModal from 'components/view/monitoring/Deploy/add/PeoModal';
import moment from 'moment';
import 'style/view/common/detailTable.less';

const FormItem = Form.Item;
const Option = Select.Option;

class AddPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      typeOption: [],
      places: [],
      peoples: [],
      peoValue: this.mapPeoples(),
      targetKeys: this.mapPeoples('id'),
      reportArr: [],
    };
    this.isRequest = false;
    this.reportUserId = '';
    this.peoplesMap = {};
  }
  componentDidMount() {
    this.searchPeople();
  }

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  handleSubmit = (type) => {
    if (this.isRequest) {
      return false;
    }
    let id;
    if (this.props.location.query && this.props.location.query.editItem) {
      id = `${this.props.location.query.editItem.id}`;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          userIds: this.state.targetKeys.join(','),
          taskTime: moment().format('YYYY-MM-DD'),
        };
        if (id) {
          params.id = id;
        }
        this.isRequest = true;
        httpAjax('post', config.apiUrl + '/api/outdoorTask/distributeTask', params).then((res) => {
          this.isRequest = false;
          if (res.code == 0) {
            message.success('发布成功！');
            this.props.history.push('/app/monitoring/itinerancy');
            /*    this.sendReport(res.data, (result) => {
                            message.info('发布成功！')
                            this.props.history.push('/app/monitoring/itinerancy');
                        })*/
          } else {
            message.error('发布失败！');
          }
        });
      }
    });
  };
  sendReport(val, backCall) {
    let user = JSON.parse(sessionStorage.getItem('user'));
    let data = {
      type: 6, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
      dataId: val.id,
      taskName: val.name,
      userId: this.reportUserId,
      approveUserId: user.id,
    };
    httpAjax('post', config.apiUrl + '/api/taskReport/saveInfo', data).then((result) => {
      if (result.code == 0) {
        backCall && backCall(result);
      }
    });
  }
  changeReport = (data) => {
    this.reportUserId = data;
  };
  searchPeople = (name = '') => {
    httpAjax('post', config.apiUrl + '/api/userCenter/getTrainer', { name }).then((res) => {
      if (res.code == 0) {
        res.data.map((item) => {
          this.peoplesMap[item.id] = item;
        });
        this.setState({ peoples: res.data });
        if (this.props.location.query && this.props.location.query.editItem) {
          let editItem = this.props.location.query.editItem;
          let reportArr = [];
          editItem.userIds.split(',').map((item) => {
            reportArr.push(this.peoplesMap[item]);
          });
          this.reportUserId = editItem.reportUserId || '';
          this.setState({
            reportArr: reportArr,
          });
        }
      }
    });
  };
  addPeople() {
    this.setState({ peoVisible: true });
  }
  handleCancel = (e) => {
    this.setState({
      orgVisible: false,
      peoVisible: false,
      changeLeft: false,
    });
  };
  handleAdd(peopleMsg) {
    let values = [];
    let targetKeys = [];
    let arr = [];
    peopleMsg.forEach((item, index) => {
      values.push(item.name);
      targetKeys.push(item.key);
      arr.push({ id: item.key, name: item.name });
    });
    this.props.form.setFieldsValue({
      members: values.join(','),
    });
    this.setState({
      peoValue: values.join(','),
      targetKeys: targetKeys,
      reportArr: arr,
    });
    this.setState({ peoVisible: false });
    if (!arr.some((item) => item.id == this.reportUserId)) {
      this.props.form.resetFields(['reportUserId']);
    }
  }
  mapPeoples = (type) => {
    if (this.props.location.query && this.props.location.query.editItem) {
      const editItem = this.props.location.query.editItem;
      const peos = editItem.userNames;
      const ids = editItem.userIds;
      return type == 'id' ? ids : peos.join(',');
    }
    return type == 'id' ? [] : '';
  };
  handleReset = () => {
    this.setState({
      peoValue: '',
    });
    this.props.form.resetFields();
  };
  render() {
    const { disabled, typeOption, places, peoples, reportArr } = this.state;
    const { getFieldDecorator } = this.props.form;
    let editItem;
    if (this.props.location.query) {
      editItem = this.props.location.query.editItem;
    }
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Card title="创建任务" bordered={true}>
            <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
              <Form className="ant-advanced-search-form">
                <Row gutter={24}>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="开始时间: " {...firstLayout} labelCol={{ span: 6 }}>
                      {getFieldDecorator('taskTime', {
                        rules: [{ required: true, message: '请选择任务计划开始时间' }],
                        initialValue: editItem ? editItem.taskTime : null,
                      })(<DatePicker />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="任务名称: " {...firstLayout} labelCol={{ span: 6 }}>
                      {getFieldDecorator('name', {
                        rules: [
                          { required: true, message: '请输入任务名称' },
                          { max: 50, message: '任务名称长度不超过50' },
                        ],
                        initialValue: editItem ? editItem.name : '',
                      })(<Input placeholder="请输入任务名称" autosize={{ minRows: 2, maxRows: 24 }} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="人员: " {...firstLayout} labelCol={{ span: 6 }}>
                      {getFieldDecorator('members', {
                        rules: [{ required: true, message: '请选择人员' }],
                        initialValue: this.state.peoValue || '',
                      })(
                        <Tooltip
                          trigger={['hover']}
                          title={this.state.peoValue}
                          placement="topLeft"
                          overlayClassName="numeric-input"
                        >
                          <Input
                            placeholder="请选择队员"
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
                </Row>
                <Row gutter={24}>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="上报人员：" {...firstLayout} labelCol={{ span: 6 }}>
                      {getFieldDecorator('reportUserId', {
                        rules: [{ required: true, message: '请选择上报人员' }],
                        initialValue: editItem ? editItem.reportUserName : '',
                      })(
                        <Select disabled={disabled} mode="single" onChange={this.changeReport}>
                          {reportArr.map((item) => (
                            <Option value={item.id + ''} key={item.id + 'place'}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="任务描述：" {...firstLayout} labelCol={{ span: 6 }}>
                      {getFieldDecorator('content', {
                        rules: [
                          { required: true, message: '请输入任务描述' },
                          { max: 1000, message: '任务描述：长度不超过1000' },
                        ],
                        initialValue: editItem ? editItem.content : '',
                      })(<Input.TextArea placeholder="任务描述" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Button type="primary" htmlType="submit" onClick={() => this.handleSubmit()}>
                      发布
                    </Button>
                    <Button style={{ marginLeft: 10 }} onClick={this.handleReset}>
                      清空
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Card>
        </Col>
        {this.state.peoVisible ? (
          <PeoModal
            visible={this.state.peoVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleAdd.bind(this)}
            targetKeys={this.state.targetKeys}
          />
        ) : null}
      </Row>
    );
  }
}

export default Form.create()(AddPlan);

// WEBPACK FOOTER //
// ./src/components/admin/monitordog/EsayTask/EsayTaskAdd.js
