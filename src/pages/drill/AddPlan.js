import React, { Component } from 'react';
import {
  Table,
  Button,
  Icon,
  Popconfirm,
  message,
  Tag,
  Card,
  Collapse,
  Row,
  Col,
  Select,
  DatePicker,
  Form,
  Input,
} from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import { firstLayout, secondLayout } from 'util/Layout';
import MapModal from './MapModal';
import moment from 'moment';
import 'style/view/common/detailTable.less';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;

class AddPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      typeOption: [],
      places: [],
      loading: true,
      peoples: [],
      isDetail: false,
      changeLeft: false,
      reportArr: [],
      trainList: [],
      saveId: '',
      placeType: '',
      placeId: '',
      dataSource: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 10,
      currPage: 1,
    };
    this.isRequest = false;
    this.reportUserId = '';
    this.peoplesMap = {};
  }
  componentDidMount() {
    sessionStorage.removeItem('tempPolygonCoords');
    const typeOption = httpAjax('post', config.apiUrl + '/api/trainingSubject/getAllTrainSubjectName');
    //const trainPlace = httpAjax('post', config.apiUrl+'/api/basicData/trainPlace');
    // /api/userCenter/getTrainer
    const Trainers = httpAjax('post', config.apiUrl + '/api/userCenter/getTrainer', { name: '' });
    const pathname = this.props.location.pathname;
    if (pathname.indexOf('Detail') > -1) {
      this.setState({ disabled: true, isDetail: true });
    } else {
      this.setState({ disabled: false });
    }
    Promise.all([typeOption, Trainers]).then((resArr) => {
      let disabledVal = false;
      /*  if(pathname.indexOf('Detail')>-1) {
                disabledVal=true;
             } else {
                 disabledVal=false;
             }*/
      this.setState({
        typeOption: resArr[0].data,
        //places: resArr[1].data,
        peoples: resArr[1].data,
        //      disabled:disabledVal
      });
      resArr[1].data.map((item) => {
        this.peoplesMap[item.id] = item;
      });
      if (this.props.location.query && this.props.location.query.editItem) {
        let editItem = this.props.location.query.editItem;
        let reportArr = [];
        editItem.userIds.split(',').map((item) => {
          reportArr.push(this.peoplesMap[item]);
        });
        this.setState({
          reportArr: reportArr,
          planId: editItem.id,
          placeType: editItem.placeType,
        });
        this.getPlanInfo();
      }
    });
    if (this.props.location.query && this.props.location.query.editItem) {
      let drawShapeDTO = this.props.location.query.editItem.drawShapeDTO;
      this.reportUserId = this.props.location.query.editItem.reportUserId || '';
      if (drawShapeDTO.latLngArr) {
        sessionStorage.setItem('tempPolygonCoords', JSON.stringify(drawShapeDTO));
        //    drawShapeDTO.coord = JSON.stringify(drawShapeDTO.latLngArr);
        this.setState({
          //  subCoord: subCoord,
          drawShapeDTO: drawShapeDTO,
        });
      }
    } else {
      sessionStorage.removeItem('tempPolygonCoords');
    }

    //基地内场地信息
    httpAjax('post', config.apiUrl + '/api/train/listAllTrainPlace', {}).then((res) => {
      if (res.code == 0) {
        this.setState({ trainList: res.data });
      }
    });
  }
  //获取训练人员详情
  getPlanInfo = (
    params = { pageSize: this.state.pageSize, currPage: this.state.currPage, planId: this.state.planId }
  ) => {
    httpAjax('post', config.apiUrl + '/api/train/getTrainRecord', params)
      .then((res) => {
        const data = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.totalCount;
        pagination.current = res.data.currPage;
        pagination.pageSize = res.data.pageSize;
        if (res.code == 0) {
          this.setState({
            loading: false,
            dataSource: res.data.list,
            pagination: pagination,
          });
        }
      })
      .catch(function (error) {
        message.error('error');
      });
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      loading: true,
    });
    this.getPlanInfo({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      planId: this.state.planId,
    });
  };
  disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };
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
          let { address, drawShapeDTO } = addressMsg;
          _this.setState(
            {
              //  subCoord: subCoord,
              drawShapeDTO: drawShapeDTO,
            },
            function () {
              _this.props.form.setFieldsValue({
                location: address,
              });
            }
          );
        }
      }
    );
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
  handleSubmit = (type) => {
    if (this.isRequest) {
      return false;
    }
    let id;
    if (this.props.location.query && this.props.location.query.editItem) {
      id = `${this.props.location.query.editItem.id}`;
    }
    console.log(id);

    let drawShapeDTO = this.state.drawShapeDTO;
    if (this.state.placeType == 2) {
      if (typeof drawShapeDTO.latLngArr == 'string' || typeof drawShapeDTO.coord == 'string') {
        try {
          drawShapeDTO.latLngArr = JSON.parse(drawShapeDTO.latLngArr);
          drawShapeDTO.coord = JSON.parse(drawShapeDTO.coord);
        } catch (e) {
          console.log(e);
        }
      }
    }
    this.isRequest = true;
    const url = type == 'save' ? '/api/train/savePlan' : '/api/train/publishPlan';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          trainDate: values.trainDate.format('x'),
          userIds: values.userIds.join(','),
          drawShapeDTO: drawShapeDTO,
        };
        if (id) {
          params.id = id;
        }
        if (this.state.saveId) {
          params.id = this.state.saveId;
        }
        httpAjax('post', config.apiUrl + url, params).then((res) => {
          this.isRequest = false;
          if (res.code == 0) {
            if (type == 'save') {
              message.success('保存成功！');
              this.setState({
                saveId: res.data,
              });
            } else {
              message.success('发布成功！');
              this.props.history.push('/view/drill/plan');
            }

            /* this.sendReport(res.data, (result) => {
                            this.props.history.push('/view/drill/plan');
                        })*/
          } else {
          }
        });
      }
    });
  };
  sendReport(val, backCall) {
    let user = JSON.parse(sessionStorage.getItem('user'));
    console.log('user', user);
    let data = {
      type: 1, //任务类型1训练2巡逻3紧急调配4网格搜捕5定点集合6外勤任务
      dataId: val.id,
      taskName: val.taskName,
      userId: this.reportUserId,
      approveUserId: user.id,
    };
    httpAjax('post', config.apiUrl + '/api/taskReport/saveInfo', data).then((result) => {
      if (result.code == 0) {
        backCall && backCall(result);
      }
    });
  }
  selectPeoples = (data) => {
    let arr = [];
    data.map((item) => {
      arr.push(this.peoplesMap[item]);
    });
    this.setState({
      reportArr: arr,
    });
    if (!arr.some((item) => item.id == this.reportUserId)) {
      this.props.form.resetFields(['reportUserId', '']);
    }
  };
  changePlaceId = (data) => {
    this.setState({
      placeId: data,
    });
  };

  changePlace = (data) => {
    this.setState({
      placeType: data,
    });
  };
  render() {
    const {
      disabled,
      typeOption,
      places,
      peoples,
      isDetail,
      location,
      reportArr,
      loading,
      dataSource,
      pagination,
      placeType,
      trainList,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    let editItem = '';
    if (this.props.location.query) {
      editItem = this.props.location.query.editItem;
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        /* render:id=>{
              return <Badge overflowCount={10000} count={id} style={{minWidth: '50px',fontSize:'12px',height:'16px',lineHeight:'16px', backgroundColor: '#99a9bf' }} /> 
            }*/
      },
      {
        title: '犬只',
        dataIndex: 'dogName',
        key: 'dogName',
      },
      {
        title: '训导员',
        dataIndex: 'trainerName',
        key: 'trainerName',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (text) => {
          if (text == '') {
            return '--';
          }
          let date = new Date(text);
          let YMD = date.toLocaleString().split(' ')[0];
          let HMS = date.toString().split(' ')[4];
          let startTime = YMD + ' ' + HMS;
          return startTime;
        },
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (text) => {
          if (text == '') {
            return '--';
          }
          let date = new Date(text);
          let YMD = date.toLocaleString().split(' ')[0];
          let HMS = date.toString().split(' ')[4];
          let endTime = YMD + ' ' + HMS;
          return endTime;
        },
      },
      {
        title: '训练状态',
        dataIndex: 'trainState',
        key: 'trainState',
        render: (state) => {
          if (state == 0) {
            return <Tag color="#2db7f5">未开始</Tag>;
          } else if (state == 1) {
            return <Tag color="#108ee9">执行中</Tag>;
          } else if (state >= 2) {
            return <Tag color="#87d068">已完成</Tag>;
          } else {
            return '--';
          }
        },
      },
    ];
    return (
      <div>
        <Row gutter={24}>
          <Col span={24}>
            <Card title="训练计划" bordered={true}>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="训练科目：" {...secondLayout}>
                        {getFieldDecorator('subjectId', {
                          rules: [{ required: true, message: '请选择训练科目' }],
                          initialValue: editItem ? editItem.subjectId : '',
                        })(
                          <Select disabled={disabled}>
                            {typeOption.map((item) => (
                              <Option value={item.id} key={item.id + 'typeOption'}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="时间" {...secondLayout}>
                        {getFieldDecorator('trainDate', {
                          rules: [{ required: true, message: '请选择时间' }],
                          initialValue: editItem && editItem.trainDate ? moment(editItem.trainDate) : null,
                        })(<DatePicker format="YYYY-MM-DD" disabled={disabled} disabledDate={this.disabledDate} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="训犬人员：" {...secondLayout}>
                        {getFieldDecorator('userIds', {
                          rules: [{ required: true, message: '请选择训犬人员' }],
                          initialValue: editItem ? editItem.userIds.split(',') : [],
                        })(
                          <Select disabled={disabled} mode="multiple" onChange={this.selectPeoples}>
                            {peoples.map((item) => (
                              <Option value={item.id + ''} key={item.id + 'place'}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="场地类型：" {...secondLayout}>
                        {getFieldDecorator('placeType', {
                          rules: [{ required: true, message: '请选择场地类型' }],
                          initialValue: editItem ? editItem.placeType : '',
                        })(
                          <Select disabled={disabled} mode="single" onChange={this.changePlace}>
                            <Option value={''} key={1}>
                              请选择场地类型
                            </Option>
                            <Option value={1} key={2}>
                              基地内
                            </Option>
                            <Option value={2} key={3}>
                              基地外
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {/* <Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                           <FormItem label='上报人员：' {...secondLayout}  >
                                                {getFieldDecorator('reportUserId',{
                                                    rules: [{ required: true, message: '请选择上报人员' }],
                                                    initialValue:editItem?editItem.reportUserName:""
                                                })(
                                                    <Select disabled={disabled} mode="single" onChange={this.changeReport}>
                                                        {reportArr.map((item) => <Option value={item.id+''} key={item.id+'place'}>{item.name}</Option>)}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>*/}
                  <Row gutter={24}>
                    {placeType && placeType == 2 ? (
                      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <FormItem label={'训练场地'} {...secondLayout} hasFeedback>
                          {getFieldDecorator('location', {
                            rules: [{ required: true, message: '请选择训练场地' }],
                            initialValue: editItem ? editItem.location : '',
                          })(
                            <Input
                              placeholder="训练场地"
                              disabled={true}
                              addonBefore={
                                <Icon type="plus" style={{ cursor: 'pointer' }} onClick={this.addCoord.bind(this)} />
                              }
                            />
                          )}
                        </FormItem>
                      </Col>
                    ) : null}
                    {placeType && placeType == 1 ? (
                      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <FormItem label="训练场地：" {...secondLayout}>
                          {getFieldDecorator('placeId', {
                            rules: [{ required: true, message: '请选择训练场地' }],
                            initialValue: editItem ? editItem.placeId + '' : '',
                          })(
                            <Select disabled={disabled} mode="single" onChange={this.changePlaceId}>
                              {trainList.map((item) => (
                                <Option value={item.id + ''} key={item.id + 'place'}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                    ) : null}
                  </Row>
                  {isDetail ? (
                    <Row gutter={24}>
                      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <FormItem label="发布时间" {...secondLayout}>
                          <Input
                            disabled={true}
                            value={
                              editItem && editItem.publishDate
                                ? moment(editItem.publishDate).format('YYYY-MM-DD HH:mm:ss')
                                : '----'
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <FormItem label="发布人员" {...secondLayout}>
                          <Input disabled={true} value={editItem && editItem.operator ? editItem.operator : '----'} />
                        </FormItem>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}

                  <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                      <FormItem label="训练说明" {...firstLayout}>
                        {getFieldDecorator('remark', {
                          // rules: [{ required: true, message: '请选择时间' }],
                          rules: [{ max: 100, message: '训练说明长度不超过100' }],
                          initialValue: editItem ? editItem.remark : '',
                        })(
                          <Input.TextArea placeholder="" disabled={disabled} autosize={{ minRows: 2, maxRows: 24 }} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {!disabled ? (
                    <Row>
                      <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Button type="primary" htmlType="submit" onClick={() => this.handleSubmit('publish')}>
                          发布
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => this.handleSubmit('save')}>
                          保存
                        </Button>
                      </Col>
                    </Row>
                  ) : null}
                </Form>
              </Col>
            </Card>
            {!disabled ? null : (
              <Card title="训练详情" bordered={true}>
                <Table
                  rowKey="id"
                  loading={loading}
                  columns={columns}
                  size="small"
                  dataSource={dataSource}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                  bordered
                />
              </Card>
            )}
          </Col>
        </Row>
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

export default Form.create()(AddPlan);

// WEBPACK FOOTER //
// ./src/components/view/drill/AddPlan.js
