import React, {Component} from 'react';
import {Row, Col, Card, Radio, Form, Input, Select, Button, Icon, Tooltip, message, DatePicker} from 'antd';
import {firstLayout, secondLayout} from 'util/Layout';
import OrgModal from './OrgModal';
import PeoModal from './PeoModal';
import MapModal from './MapModal';
import httpAjax from 'libs/httpAjax';
import Moment from 'moment';
import {debug} from 'util';
const RangePicker = DatePicker.RangePicker;
const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '123',
      orgVisible: false,
      peoVisible: false,
      peoValue: '请添加巡逻人员',
      targetKeys: [], //保存作战人员key
      changeLeft: false, //是否显示地图
      startDateStr: '',
      selectTime: '',
      combatType: '',
      currentDraftId: '', //当前草稿id
      reportArr: []
    };
    this.isRequest = false;
    this.reportUserId = '';
    this.peoplesMap = {};
  }
  componentDidMount() {
    if (this.props.location.query) {
      const id = this.props.location.query.id;
      httpAjax('post', config.apiUrl + '/api/dailyPatrols/getDailyPatrolsById', {id}).then((res) => {
        if (res.code == 0) {
          let reportArr = [];
          /*   let nameArr = res.data.userNames.split(',');
          res.data.userIds.split(',').map((item, index)=>{
              reportArr.push({id: item, name: nameArr[index]});
          })*/

          this.reportUserId = res.data.reportUserId;
          const _userMap = res.data.userMap || {};
          const _peoValue = (() => {
            const t = [];
            for (const i in _userMap) {
              t.push(_userMap[i]);
            }
            return t;
          })();
          // _rangeDate = [rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'), rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss')];
          const _rangeDate = [
            Moment(res.data.startTime, 'YYYY-MM-DD HH:mm:ss'),
            Moment(res.data.endTime, 'YYYY-MM-DD HH:mm:ss')
          ];
          (reportArr = (() => {
            const t = [];
            for (const i in _userMap) {
              t.push({id: i, name: _userMap[i]});
            }
            return t;
          })()),
            this.setState({
              ...res.data,
              reportArr: reportArr,
              targetKeys: (_userMap && Object.keys(_userMap).map((t) => Number(t))) || [],
              peoValue: _peoValue.join(','),
              rangeDate: _rangeDate
            });
          sessionStorage.setItem('tempPolygonCoords', JSON.stringify(res.data.drawShapeDTO));
        }
      });
    } else {
      sessionStorage.removeItem('tempPolygonCoords');
    }
  }
  handleSubmit = (type) => {
    if (this.isRequest) {
      return false;
    }
    const {history} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {subCoord, targetKeys, drawShapeDTO, startDateStr, combatType} = this.state;
        const rangeTimeValue = values['range-time-picker'];
        let rangeValueArr = ['', ''];
        if (!(typeof rangeTimeValue === 'undefined' || rangeTimeValue.length == 0)) {
          rangeValueArr = [
            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss')
          ];
        }
        if (typeof drawShapeDTO.latLngArr === 'string' || typeof drawShapeDTO.coord === 'string') {
          try {
            drawShapeDTO.latLngArr = JSON.parse(drawShapeDTO.latLngArr);
            drawShapeDTO.coord = JSON.parse(drawShapeDTO.coord);
          } catch (e) {
            console.log(e);
          }
        }
        const subData = {
          taskName: values.taskName,
          // latitude:subCoord.lat,
          // longitude:subCoord.lng,
          taskContent: values.taskContent,
          //combatType: combatType,
          // taskType:1||parseInt(values.taskType),
          userIds: targetKeys.join(','),
          reportUserId: this.reportUserId,
          patrolsLocation: values.patrolsLocation,
          drawShapeDTO: drawShapeDTO,
          startTime: rangeValueArr[0],
          endTime: rangeValueArr[1]
        };
        // 新增草稿
        const _currentDraftId = this.state.currentDraftId;
        if (_currentDraftId) {
          subData.id = _currentDraftId;
        }
        // 修改草稿
        if (this.props.location.query) {
          const id = this.props.location.query.id;
          subData.id = id;
        }
        this.isRequest = true;
        const apiType = type == 'save' ? 'saveDraftInfo' : 'distributeTask';
        httpAjax('post', config.apiUrl + `/api/dailyPatrols/${apiType}`, {...subData}).then((res) => {
          this.isRequest = false;
          if (res) {
            /*  this.sendReport(res.data, (result) => {
              
              })*/
            if (type == 'save') {
              this.setState({currentDraftId: res.data});
              message.success('保存成功！');
            } else {
              message.success('发布成功！页面即将跳转...', 2, function () {
                history.push({pathname: '/app/monitoring/duty'});
              });
            }
          } else {
            message.error('系统错误！请重试...');
          }
        });
      }
    });
  };
  sendReport(val, backCall) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const data = {
      type: 1, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
      dataId: val.id,
      taskName: val.taskName,
      userId: this.reportUserId,
      approveUserId: user.id
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
  handleReset = () => {
    this.setState({
      peoValue: ''
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
      this.setState({orgVisible: false});
    });
  };
  handleAdd(peopleMsg) {
    const values = [];
    const targetKeys = [];
    const arr = [];
    peopleMsg.forEach((item, index) => {
      values.push(item.name);
      targetKeys.push(item.key);
      arr.push({id: item.key, name: item.name});
    });
    this.props.form.setFieldsValue({
      userIds: values.join(',')
    });
    this.setState({
      peoValue: values.join(','),
      targetKeys: targetKeys,
      reportArr: arr
    });
    this.setState({peoVisible: false});
    if (!arr.some((item) => item.id == this.reportUserId)) {
      this.props.form.resetFields(['reportUserId', '']);
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
      this.setState({changeLeft: false});
    });
  };
  handleCancel = (e) => {
    this.setState({
      orgVisible: false,
      peoVisible: false,
      changeLeft: false
    });
  };
  addOrg() {
    this.setState({orgVisible: true});
    this.props.form.setFieldsValue({
      taskOrigin: this.state.value
    });
  }
  addPeople() {
    this.setState({peoVisible: true});
  }
  addCoord() {
    this.setState({changeLeft: true});
  }
  handleShow(addressMsg) {
    const _this = this;
    this.setState(
      {
        changeLeft: false
      },
      function () {
        if (typeof addressMsg !== 'undefined') {
          const {address, drawShapeDTO} = addressMsg;
          _this.setState(
            {
              //  subCoord: subCoord,
              drawShapeDTO: drawShapeDTO
            },
            function () {
              _this.props.form.setFieldsValue({
                patrolsLocation: address
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
    const {getFieldDecorator} = this.props.form;
    const {
      taskName,
      patrolsLocation,
      userIds,
      combatType,
      taskContent,
      startDateStr,
      rangeDate,
      reportArr,
      reportUserName
    } = this.state;
    console.log(this.state);
    return (
      <div className="AddTask">
        <Row gutter={24}>
          <Col span={24}>
            <Card title="日常巡逻" bordered>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'任务名称'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('taskName', {
                          rules: [
                            {required: true, message: '请输入任务名称'},
                            {max: 50, message: '任务名称长度不超过50'}
                          ],
                          initialValue: taskName || ''
                        })(<Input placeholder="任务名称" />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'巡逻地点'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('patrolsLocation', {
                          rules: [{required: true, message: '请选择巡逻地点'}],
                          initialValue: patrolsLocation || ''
                        })(
                          <Input
                            placeholder="巡逻地点"
                            disabled
                            addonBefore={
                              <Icon type="plus" style={{cursor: 'pointer'}} onClick={this.addCoord.bind(this)} />
                            }
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label={'巡逻人员'} {...secondLayout} hasFeedback>
                        {getFieldDecorator('userIds', {
                          rules: [{required: true, message: '请添加巡逻人员'}],
                          initialValue: this.state.peoValue || ''
                        })(
                          <Tooltip
                            trigger={['hover']}
                            title={this.state.peoValue}
                            placement="topLeft"
                            overlayClassName="numeric-input">
                            <Input
                              placeholder="巡逻人员"
                              value={this.state.peoValue}
                              disabled
                              addonBefore={
                                <Icon type="plus" style={{cursor: 'pointer'}} onClick={this.addPeople.bind(this)} />
                              }
                            />
                          </Tooltip>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="时间" {...secondLayout}>
                        {getFieldDecorator('range-time-picker', {
                          rules: [{required: true, message: '请选择时间段', type: 'array'}],
                          initialValue: rangeDate || []
                        })(<RangePicker showTime="true" format="YYYY-MM-DD HH:mm:ss" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="上报人员：" {...secondLayout} labelCol={{span: 6}}>
                        {getFieldDecorator('reportUserId', {
                          rules: [{required: true, message: '请选择上报人员'}],
                          initialValue: reportUserName || ''
                        })(
                          <Select mode="single" onChange={this.changeReport}>
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
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                      <FormItem label={'巡逻内容'} {...firstLayout} hasFeedback>
                        {getFieldDecorator('taskContent', {
                          rules: [
                            {required: true, message: '请输入巡逻内容'},
                            {max: 1000, message: '巡逻内容长度不超过1000'}
                          ],
                          initialValue: taskContent || ''
                        })(<TextArea placeholder="巡逻内容" autosize={{minRows: 3, maxRows: 6}} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} style={{textAlign: 'center', marginTop: '40px'}}>
                      <Button type="primary" onClick={() => this.handleSubmit('save')}>
                        保存草稿
                      </Button>
                      <Button type="primary" style={{marginLeft: 8}} onClick={() => this.handleSubmit('publish')}>
                        立即发布
                      </Button>
                      <Button style={{marginLeft: 8}} onClick={this.handleReset}>
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

// WEBPACK FOOTER //
// ./src/components/view/monitoring/AddPatrols/AddTask.js
