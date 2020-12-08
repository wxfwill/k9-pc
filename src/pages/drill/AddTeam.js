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
} from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import { firstLayout, secondLayout } from 'util/Layout';
import PeoModal from '../monitoring/Deploy/add/PeoModal';
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
      peoples: [],
      peoValue: this.mapPeoples(),
      targetKeys: this.mapPeoples('id'),
    };
  }
  componentDidMount() {
    this.searchPeople();
  }

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  handleSubmit = (type) => {
    let id;
    if (this.props.location.query && this.props.location.query.editItem) {
      id = `${this.props.location.query.editItem.id}`;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const params = {
          ...values,
          members: this.state.targetKeys,
        };
        if (id) {
          params.id = id;
        }
        React.$ajax.postData('/api/train/saveTeam', params).then((res) => {
          if (res.code == 0) {
            this.props.history.push('/app/drill/team');
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
    this.setState({ peoVisible: true });
  }

  checkName = (rule, value, callback) => {
    let editItem = '';
    let initName = '';
    if (this.props.location.query && this.props.location.query.editItem) {
      editItem = this.props.location.query.editItem;
      initName = editItem.name;
    }

    this.httpAjaxHadnle('name', value, (res) => {
      if (rule.field == 'name') {
        if (!res.data && initName != value) {
          callback('队名重复');
        } else {
          callback();
        }
      }
    });
  };

  // 请求后台验证
  httpAjaxHadnle = (key, value, callback) => {
    let param = new FormData(),
      configs = { headers: { 'Content-Type': 'multipart/form-data' } };
    param.append(key, value);
    httpAjax('post', config.apiUrl + '/api/train/isNotExistTeamName', param, configs).then(callback);
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
    if (this.props.location.query && this.props.location.query.editItem) {
      const editItem = this.props.location.query.editItem;
      const peos = editItem.members.map((t) => t.userName);
      const ids = editItem.members.map((t) => t.userId);
      return type == 'id' ? ids : peos.join(',');
    }
    return type == 'id' ? [] : '';
  };
  render() {
    console.log(this.state);
    const { disabled, typeOption, places, peoples } = this.state;
    const { getFieldDecorator } = this.props.form;
    let editItem;
    if (this.props.location.query) {
      editItem = this.props.location.query.editItem;
    }
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Card title="创建分组" bordered={true}>
            <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
              <Form className="ant-advanced-search-form">
                <Row gutter={24}>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="队名" {...firstLayout}>
                      {getFieldDecorator('name', {
                        rules: [
                          { required: true, message: '请输入队名' },
                          { max: 20, message: '队名长度不超过20' },
                          { validator: this.checkName },
                        ],
                        initialValue: editItem ? editItem.name : '',
                      })(<Input placeholder="请输入队名" autosize={{ minRows: 2, maxRows: 24 }} />)}
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="队长" {...firstLayout}>
                      {getFieldDecorator('leaderId', {
                        rules: [{ required: true, message: '请选择队长' }],
                        initialValue: editItem ? editItem.leader.userId + '' : '',
                      })(
                        <Select
                          placeholder="请选择队长"
                          optionLabelProp="children"
                          showSearch
                          autosize={{ minRows: 2, maxRows: 24 }}
                          // onChange={(a,b,c) => {console.log(a,b,c)}}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {peoples.map((item) => (
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
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label="队员" {...firstLayout}>
                      {getFieldDecorator('members', {
                        rules: [{ required: true, message: '请选择队员' }],
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
                <Row>
                  <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Button type="primary" htmlType="submit" onClick={() => this.handleSubmit('publish')}>
                      保存
                    </Button>
                    {/* <Button style={{ marginLeft: 8 }} onClick={() => this.handleSubmit('save')}>保存</Button> */}
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
// ./src/components/view/drill/AddTeam.js
