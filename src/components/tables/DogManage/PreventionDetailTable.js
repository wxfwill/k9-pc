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
} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;
import 'style/view/common/detailTable.less';
class DogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      dogInfo: '',
      title: '防治记录',
      isEdit: false,
      vaccineType: '',
      vaccineTime: '',
      nextVaccineRemindingTime: '',
      detailData: {},
    };
  }
  componentDidMount() {
    const id = this.props.location.query && this.props.location.query.id;

    // console.log(id)
    const formStatus = sessionStorage.getItem('formStatus');
    this.setState({ loading: true });
    React.$ajax.postData('/api/vaccineRecord/planInfo', { id }).then((res) => {
      if (res.code == 0) {
        this.setState({
          detailData: res.data,
          loading: false,
        });
      }
    });
    if (formStatus == 'edit') {
      this.setState({ isEdit: true });
    }
  }
  baseHeader = () => {
    return (
      <div>
        <Icon type="bars" />
        &nbsp;&nbsp;&nbsp;
        <Tag color="#2db7f5">基础信息</Tag>
      </div>
    );
  };
  checkHeader() {
    const { title } = this.state;
    return (
      <div>
        <Icon type="bars" />
        &nbsp;&nbsp;&nbsp;
        <Tag color="#2db7f5">{title}</Tag>
      </div>
    );
  }
  editInfo = (key, record) => {
    this.setState({
      vaccineType: record.vaccineTime,
      vaccineType: record.vaccineType,
      nextVaccineRemindingTime: record.nextVaccineRemindingTime,
    });
    const newData = [...this.state.dataSource];
    newData.map((item, index) => {
      if (item.editable) {
        delete item.editable;
      }
    });
    const target = newData.filter((item) => key === item.id)[0];
    if (target) {
      target.editable = true;
      this.setState({ dataSource: newData });
    }
  };
  mapVaccineType = (type) => {
    switch (type) {
      case 1:
        return '掉毛';
      case 2:
        return '呕吐';
      case 3:
        return '发热';
      case 4:
        return '搜箱包';
      case 5:
        return '追踪';
      default:
        type;
    }
  };
  renderVaccineName = (text, record) => {
    const { getFieldDecorator } = this.props.form;
    const vaccineType = JSON.parse(sessionStorage.getItem('vaccineType'));
    const vaccineOption =
      vaccineType &&
      vaccineType.map((item, index) => {
        return (
          <Option value={item.id} key={index}>
            {item.name}
          </Option>
        );
      });
    if (record.editable) {
      return (
        <Form>
          <FormItem>
            {getFieldDecorator('vaccineType', {
              rules: [{ required: true, message: '请选择疫苗类型' }],
              initialValue: this.mapVaccineType(record.vaccineType),
            })(
              <Select onChange={(value) => this.onSelectChange(value, record.id)} style={{ width: '100%' }}>
                {vaccineOption}
              </Select>
            )}
          </FormItem>
        </Form>
      );
    } else {
      return text;
    }
  };
  onSelectChange = (value, key) => {
    this.setState({ vaccineType: value });
    const newData = [...this.state.dataSource];
    const target = newData.filter((item) => key === item.id)[0];
    if (target) {
      target['vaccineName'] = value;
      this.setState({ dataSource: newData });
    }
  };
  //不可选日期
  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  renderTimer(text, record, column) {
    const { getFieldDecorator } = this.props.form;
    if (record.editable) {
      if (column == 'vaccineTime') {
        return (
          <Form>
            <FormItem>
              {getFieldDecorator('vaccineTime', {
                rules: [{ required: true, message: '请选择疫苗注射时间' }],
                initialValue: moment(new Date(text)),
              })(<DatePicker format="YYYY-MM-DD" disabledDate={this.disabledDate} />)}
            </FormItem>
          </Form>
        );
      } else if (column == 'nextVaccineRemindingTime') {
        return (
          <Form>
            <FormItem>
              {getFieldDecorator('nextVaccineRemindingTime', {
                rules: [{ required: true, message: '请选择下次疫苗注射时间' }],
                initialValue: moment(new Date(text)),
              })(<DatePicker format="YYYY-MM-DD" disabledDate={this.disabledDate} />)}
            </FormItem>
          </Form>
        );
      }
    } else {
      return moment(text).format('YYYY-MM-DD');
    }
  }
  cancel = (record) => {
    const newData = [...this.state.dataSource];
    const target = newData.filter((item) => record.id === item.id)[0];
    if (target) {
      //Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
      target.vaccineName = record.vaccineName;
      delete target.editable;
      this.setState({ dataSource: newData });
    }
  };
  //保存编辑内容
  save = (key) => {
    const newData = [...this.state.dataSource];
    const { id } = JSON.parse(sessionStorage.getItem('user'));
    const dogId = sessionStorage.getItem('dogId');
    const target = newData.filter((item) => key === item.id)[0];
    let configs = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    if (target) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let param = new FormData(); // 创建form对象
          if (values.vaccineTime) {
            values.vaccineTime = moment(new Date(values.vaccineTime)).format('YYYY-MM-DD');
          }
          if (values.nextVaccineRemindingTime) {
            values.nextVaccineRemindingTime = moment(new Date(values.nextVaccineRemindingTime)).format('YYYY-MM-DD');
          }
          param.append('vaccineTime', values.vaccineTime);
          param.append('nextVaccineRemindingTime', values.nextVaccineRemindingTime);
          param.append('vaccineType', values.vaccineType);
          param.append('userId', id);
          param.append('ids', key);
          React.$ajax.postData('/api/vaccineRecord/saveInfo', param, configs).then((res) => {
            if (res.code == 0) {
              message.success('修改成功');
            } else {
              message.error('修改失败');
            }
          });
        }
      });
    }
  };
  render() {
    const { dataSource, loading, dogInfo, isEdit, detailData } = this.state;
    //console.log(this.state);
    const recordsColumns = [
      {
        title: '序号',
        dataIndex: 'planId',
        key: Math.random(),
        // render:(text,record)=>this.renderVaccineName(text,record)
      },
      {
        title: '注射时间',
        dataIndex: 'vaccineTime',
        key: Math.random(),
        render: (text, record) => moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '犬名',
        dataIndex: 'dogName',
        key: Math.random(),
        // render:(text, record) => this.renderTimer(text, record,"nextVaccineRemindingTime")
      },
      {
        title: '药物',
        dataIndex: 'veterinaryName',
        key: Math.random(),
        render: () => detailData.vaccineTypeNames,
      },
    ];
    // if(isEdit){
    //     recordsColumns.push(
    //       {
    //         title:'操作',
    //         dataIndex:'id',
    //         render:(text,record,index)=>{
    //           return  <div className="editable-row-operations">
    //               {
    //                 record.editable ?
    //                   <span>
    //                   <Button onClick={() => this.save(record.id)} size='small' style={{marginRight:'10px'}}>保存</Button>
    //                   <Popconfirm title="确定取消编辑?" onConfirm={() => this.cancel(record)}>
    //                      <a>取消</a>
    //                   </Popconfirm>
    //                   </span>
    //                   : <div>
    //                     <Button size='small' style={{marginRight:'10px'}}    onClick={()=>this.editInfo(record.id,record)} >编辑</Button>
    //                   </div>
    //               }
    //             </div>
    //         }
    //       }
    //     )
    // }
    return (
      <div>
        <Card title={this.state.title}>
          <Collapse defaultActiveKey={['1', '2']}>
            <Panel showArrow={false} header={this.baseHeader()} key="1">
              <Row gutter={24}>
                <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24}>
                  <div className="baseDataTable">
                    <Row>
                      <Col span={6}>计划名称</Col>
                      <Col span={6}>{detailData.name}</Col>
                      <Col span={6}>计划时间</Col>
                      <Col span={6}>{moment(detailData.planDate).format('YYYY-MM-DD')}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>执行状态</Col>
                      <Col span={6}>{detailData.status == 0 ? '未执行' : '已执行'}</Col>
                      <Col span={6}>药物名称</Col>
                      <Col span={6}>{detailData.vaccineTypeNames}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>执行时间</Col>
                      <Col span={6}>
                        {detailData.excuteDate ? moment(detailData.excuteDate).format('YYYY-MM-DD') : '--'}
                      </Col>
                      <Col span={6}>发布人</Col>
                      <Col span={6}>{}</Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Panel>
            <Panel showArrow={false} header={this.checkHeader()} key="2">
              <Row gutter={24}>
                <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24}>
                  <Table
                    loading={loading}
                    columns={recordsColumns}
                    dataSource={detailData.detailRecords}
                    pagination={false}
                    bordered
                    rowKey="id"
                  />
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
export default Form.create()(DogTable);

// WEBPACK FOOTER //
// ./src/components/admin/tables/DogManage/PreventionDetailTable.js
