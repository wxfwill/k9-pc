import React, { Component } from 'react';
import { Row, Col, Card, Radio, Form, Input, Select, Button, Icon, Tooltip, message, DatePicker } from 'antd';
import { firstLayout, secondLayout } from 'components/view/common/Layout';
import OrgModal from './add/OrgModal';
import PeoModal from './add/PeoModal';
import MapModal from './add/MapModal';
import httpAjax from 'libs/httpAjax';
import Moment from 'moment';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const combatTypeObj = { 1: '反恐处突', 2: '突发事件', 3: '侦查破案', 4: ' 重点安保' };
const combatTypeList = [{ num: 1, text: '反恐处突' }, { num: 2, text: '突发事件' }, { num: 3, text: '侦查破案' }, { num: 4, text: '重点安保' }]

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '123',
      orgVisible: false,
      peoVisible: false,
      peoValue: '请添加作战人员',
      targetKeys: [],//保存作战人员key
      changeLeft: false,//是否显示地图
      startDateStr: '',
      selectTime: '',
      combatType: '',
      reportArr: [],
    }
    this.isRequest = false;
    this.reportUserId = '';
    this.peoplesMap = {};
  }
  componentDidMount() {
    sessionStorage.removeItem("tempPolygonCoords");
  }
  handleSubmit = (type) => {
    if(this.isRequest){
        return false;
    }
    let { history } = this.props;
    this.props.form.validateFields(
      (err, values) => {
        if (!err) {
          let { subCoord, targetKeys, startDateStr, combatType, point } = this.state;
          let subData = {
            taskName: values.taskName,
            userIds: targetKeys,
            location: values.location,
            reportUserId: this.reportUserId,
            assembleTime: values.assembleTime.format('x'),
            lat: point.lat,
            lng: point.lng
          }
          this.isRequest = true;
          httpAjax('post', config.apiUrl + '/api/cmdMonitor/saveAssemblePoint', { ...subData }).then((res) => {
            this.isRequest = false;
            if (res.code == 0) {
             /* this.sendReport(res.data, (result) => {
                
              })*/
              if (type == 'save') {
                message.success('保存成功！');
              } else {
                message.success('发布成功！页面即将跳转...', 2, function () {
                  history.push({ pathname: '/app/monitoring/assemble' });
                });
              }

            } else {
              message.error('系统错误！请重试...');
            }
          })
        }
      },
    );
  }
  sendReport(val, backCall){
      let user = JSON.parse(sessionStorage.getItem('user'));
      let data = {
          type: 5, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
          dataId: val.id,
          taskName: val.taskName,
          userId: this.reportUserId,
          approveUserId: user.id
      }
      httpAjax('post', config.apiUrl+'/api/taskReport/saveInfo', data).then((result) => {
          if(result.code == 0){
              backCall && backCall(result)
          }
      })
  }
  changeReport = (data) => {
      this.reportUserId = data;
  }
  handleReset = () => {
    this.setState({
      peoValue: '',
      address:'',
      startDateStr:'',

    })
    this.props.form.resetFields();
  }
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
  }
  handleAdd(peopleMsg) {
    let values = [];
    let targetKeys = [];
    let arr = [];
    peopleMsg.forEach((item, index) => {
      values.push(item.name);
      targetKeys.push(item.key);
      arr.push({id: item.key, name: item.name})
    })
    this.props.form.setFieldsValue({
      userIds: values.join(',')
    });
    this.setState({
      peoValue: values.join(','),
      targetKeys: targetKeys,
      reportArr: arr
    })
    this.setState({ peoVisible: false });
    if(!arr.some((item) => item.id == this.reportUserId)){
        this.props.form.resetFields(['reportUserId','']);
    }
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
  }
  handleCancel = (e) => {
    this.setState({
      orgVisible: false,
      peoVisible: false,
      changeLeft: false
    });
  }
  addOrg() {
    this.setState({ orgVisible: true });
    this.props.form.setFieldsValue({
      taskOrigin: this.state.value
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
    this.setState({
      changeLeft: false
    }, function () {
      if (typeof addressMsg != 'undefined') {
        let { point, address,  } = addressMsg;
        _this.setState({
            point, address,
        }, function () {
          _this.props.form.setFieldsValue({
            location: address
          });
        })
      }
    })
  }
  orgFormRef = (form) => {
    this.orgForm = form;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { taskName, location, userIds, combatType, taskContent, startDateStr, reportArr, } = this.state;
    return (
      <div className="AddTask">
        <Row gutter={24}>
          <Col span={24}>
            <Card title='新增定点集合' bordered={true}>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form
                  className="ant-advanced-search-form"
                >
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'任务名称'} {...secondLayout} hasFeedback >
                        {getFieldDecorator('taskName', {
                          rules: [{ required: true, message: '请输入任务名称' },{ max: 25, message: '任务名称长度不超过25' }],
                          initialValue: taskName || ''
                        })(
                          <Input placeholder="任务名称" />
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'选择集合点'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('location', {
                          rules: [{ required: true, message: '请选择集合点' }],
                          initialValue: this.state.address || ''
                        }
                        )(
                          <Input placeholder="集合点" disabled={true} addonBefore={<Icon type="plus" style={{ cursor: 'pointer' }} onClick={this.addCoord.bind(this)} />} />
                        )}
                      </FormItem>

                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24} >
                      <FormItem label={'选择人员'} {...secondLayout} hasFeedback >
                        {getFieldDecorator('userIds', {
                          rules: [{ required: true, message: '请添加集合人员' }],
                          initialValue: this.state.peoValue || ''
                        })(
                          <Tooltip
                            trigger={['hover']}
                            title={this.state.peoValue}
                            placement="topLeft"
                            overlayClassName="numeric-input"
                          >
                            <Input placeholder="集合人员" value={this.state.peoValue} disabled={true} addonBefore={<Icon type="plus" style={{ cursor: 'pointer' }} onClick={this.addPeople.bind(this)} />} />
                          </Tooltip>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'选择日期'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('assembleTime', {
                          rules: [{ required: true, message: '请选择日期' }],
                          initialValue: startDateStr ? Moment(startDateStr) : null
                        }
                        )(
                          <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            onChange={(value, dateString) => { this.setState({ startDateStr: dateString }) }}
                            disabledDate={current => current && current.isBefore(new Date(new Date().getTime() - 24*60*60*1000))}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                         <FormItem label='上报人员：' {...secondLayout} labelCol={{span: 6}} >
                              {getFieldDecorator('reportUserId',{
                                  rules: [{ required: true, message: '请选择上报人员' }],
                              })(
                                  <Select mode="single" onChange={this.changeReport}>
                                      {reportArr.map((item) => <Option value={item.id+''} key={item.id+'place'}>{item.name}</Option>)}
                                  </Select>
                              )}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row>
                    <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                      <Button type="primary" style={{ marginLeft: 8 }} onClick={() => this.handleSubmit('publish')}>发布</Button>
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
        {this.state.peoVisible ? <PeoModal
          visible={this.state.peoVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleAdd.bind(this)}
          targetKeys={this.state.targetKeys}
        /> : null}
        {this.state.changeLeft ? <MapModal
          changeLeft={this.state.changeLeft}
          handleShow={this.handleShow.bind(this)}
          onCancel={this.handleCancel}
          onCreate={this.handleCoo}
        /> : null}
      </div>
    )
  }
}
const AddTask = Form.create()(AddForm);

export default AddTask;


// WEBPACK FOOTER //
// ./src/components/admin/monitordog/assemble/AssembleAdd.js