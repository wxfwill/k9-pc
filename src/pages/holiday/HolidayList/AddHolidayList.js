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
  Tooltip,
  Calendar,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { firstLayout, secondLayout } from 'util/Layout';
import PeoModal from './PeoModal';
import moment from 'moment';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;

class AddHoliday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      typeOption: [],
      places: [],
      years: [],
      peoples: [],
      leaveYear: '',
      typeId: '',
      holidayTypes: [],
      peoValue: this.mapPeoples(),
      targetKeys: this.mapPeoples('id'),
    };
  }
  componentDidMount() {
    this.searchPeople();
    if (this.props.location.query && this.props.location.query.detailsFlag) {
      this.setState({ disabled: true });
    }
    //获取假期类型
    React.$ajax.postData('/api/leaveRecord/getLeaveTypeList', {}).then((res) => {
      if (res.code == 0) {
        let currentYear = Number(moment(new Date()).format('YYYY'));
        let { years } = this.state;
        for (let i = 0; i <= 100; i++) {
          years.push({ id: currentYear + i, name: currentYear + i + '年' });
        }
        this.setState({ holidayTypes: res.data, years: years });
        sessionStorage.setItem('holidayTypes', JSON.stringify(res.data));
      }
    });
  }

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  handleSubmit = (type) => {
    let id;
    if (this.props.location.query && this.props.location.query.record) {
      id = `${this.props.location.query.record.id}`;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          userIdList: this.state.targetKeys,
        };
        if (id) {
          params.id = id;
        }
        React.$ajax.postData('/api/leaveRecord/saveLeaveUser', params).then((res) => {
          if (res.code == 0) {
            this.props.history.push('/app/holiday/holidayList');
            message.info('保存成功！');
          } else {
            message.error('保存失败！');
          }
        });
      }
    });
  };
  searchPeople = (name = '') => {
    React.$ajax.postData('/api/userCenter/getTrainer', { name }).then((res) => {
      if (res.code == 0) {
        this.setState({ peoples: res.data });
      }
    });
  };
  addPeople() {
    let leaveYear = this.props.form.getFieldValue('leaveYear');
    let typeId = this.props.form.getFieldValue('typeId');
    if (leaveYear && typeId) {
      this.setState({ peoVisible: true, leaveYear: leaveYear, typeId: typeId });
    } else {
      message.info('请先选择年份和假期类型！');
    }
  }

  // 请求后台验证
  httpAjaxHadnle = (key, value, callback) => {
    let param = new FormData(),
      configs = { headers: { 'Content-Type': 'multipart/form-data' } };
    param.append(key, value);
    //httpAjax('post', config.apiUrl + '/api/train/isNotExistTeamName', param, configs).then(callback);
    React.$ajax.postData('/api/train/isNotExistTeamName', param).then(callback);
  };

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
    peopleMsg.forEach((item, index) => {
      values.push(item.name);
      targetKeys.push(item.key);
    });
    this.props.form.setFieldsValue({
      members: values.join(','),
    });
    this.setState({
      peoValue: values.join(','),
      targetKeys: targetKeys,
    });
    this.setState({ peoVisible: false });
  }
  mapPeoples = (type) => {
    /*  if(this.props.location.query&&this.props.location.query.record) {
           const record = this.props.location.query.record;
            const peos = record.members.map((t) => t.userName);
            const ids = record.members.map((t) => t.userId);
            return type=='id'?ids:peos.join(',');
        }
		return type=='id'?[]:'';*/
    if (this.props.location.query && this.props.location.query.record) {
      const record = this.props.location.query.record;
      let peos = [];
      let ids = [];
      peos.push(record.name);
      ids.push(record.userId);
      return type == 'id' ? ids : peos;
    }
    return type == 'id' ? [] : '';
  };
  onSelect = (value) => {
    this.setState({
      value,
      selectedValue: value,
    });
  };
  render() {
    const { disabled, typeOption, places, years, holidayTypes } = this.state;
    const { getFieldDecorator } = this.props.form;
    let record;
    if (this.props.location.query) {
      record = this.props.location.query.record;
    }

    const holidayTypesOption =
      holidayTypes &&
      holidayTypes.map((item, index) => {
        return (
          <Option value={item.typeId} key={index}>
            {item.typeName}
          </Option>
        );
      });
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Card title="假期配置" bordered={true}>
            <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
              <Form className="ant-advanced-search-form">
                <Row gutter={24}>
                  <Col xl={16} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="选择年份" {...firstLayout}>
                      {getFieldDecorator('leaveYear', {
                        rules: [{ required: false, message: '请选择年份' }],
                        initialValue: (record && record.leaveYear) || '',
                      })(
                        <Select
                          placeholder="选择年份"
                          optionLabelProp="children"
                          showSearch
                          autosize={{ minRows: 2, maxRows: 24 }}
                          disabled={this.state.disabled}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {years.map((item) => (
                            <Option value={item.id + ''} key={item.id + '_peo'}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xl={16} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="假期类型" {...firstLayout}>
                      {getFieldDecorator('typeId', {
                        rules: [{ required: true, message: '请选择假期类型' }],
                        initialValue: (record && record.typeId) || '',
                      })(
                        <Select placeholder="请选择假期类型" disabled={this.state.disabled}>
                          {holidayTypesOption}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xl={16} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="天数设定" {...firstLayout}>
                      {getFieldDecorator('totalDay', {
                        rules: [{ required: true, message: '请输入天数' }, { validator: this.checkName }],
                        initialValue: (record && record.totalDay) || '',
                      })(
                        <Input
                          placeholder="请输入天数"
                          autosize={{ minRows: 2, maxRows: 24 }}
                          disabled={this.state.disabled}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xl={16} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="选择人员" {...firstLayout}>
                      {getFieldDecorator('userIdList', {
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
                            placeholder="请选择人员"
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
                <Row>
                  <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                    {disabled ? null : (
                      <Button type="primary" htmlType="submit" onClick={() => this.handleSubmit('publish')}>
                        保存
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form>
            </Col>
          </Card>
        </Col>
        {this.state.peoVisible ? (
          <PeoModal
            visible={this.state.peoVisible}
            leaveYear={this.state.leaveYear}
            typeId={this.state.typeId}
            onCancel={this.handleCancel}
            onCreate={this.handleAdd.bind(this)}
            targetKeys={this.state.targetKeys}
          />
        ) : null}
      </Row>
    );
  }
}

export default Form.create()(withRouter(AddHoliday));

// WEBPACK FOOTER //
// ./src/components/admin/holiday/HolidayList/AddHolidayList.js
