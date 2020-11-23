import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, TreeSelect, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import moment from 'moment';
const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      dutyList: [],
      teamData: [],
      feedbalVal: null,
    };
  }
  componentDidMount() {
    this.queryAllTeam();
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      this.props.handleSearchData && this.props.handleSearchData(values);
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  //中队
  queryAllTeam = () => {
    React.$ajax.common.queryAllGroups().then((res) => {
      if (res.code == 0) {
        let resObj = res.data;
        let newArr = [];
        for (let key in resObj) {
          let obj = { id: key, name: resObj[key] };
          newArr.push(obj);
        }
        this.setState({ teamData: newArr });
      }
    });
  };
  selectHouseId = () => {};
  onChangeStartTime = () => {};
  onChangeEndTime = () => {};
  selectTaskType = () => {};
  hangdleFeedback = () => {};
  handlePrif = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.exportLeaveLiust && this.props.exportLeaveLiust(values);
    });
  };
  handleTreeName = () => {};
  treeNodes = (arr) => {
    arr.map((item) => {
      if (item.children && item.children.length > 0) {
        return this.treeNodes(item.children);
      } else {
        return (
          <TreeNode
            value={item.name || item.id}
            title={item.name}
            key={item.name || item.id}
            selectable={false}
          ></TreeNode>
        );
      }
    });
  };
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="中队:" {...thirdLayout}>
              {getFieldDecorator('groupIds')(
                <Select placeholder="请选择" allowClear onChange={this.selectHouseId}>
                  {this.state.teamData.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="姓名:" {...thirdLayout}>
              {getFieldDecorator('userIds', {
                initialValue: undefined,
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
                    setFieldsValue({ userIds: undefined });
                    this.props.queryGroupUser && this.props.queryGroupUser(value);
                  }}
                  onChange={this.handleTreeName}
                >
                  {this.props.userArr && this.props.userArr.length > 0
                    ? this.props.userArr.map((item) => {
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
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="开始时间" {...thirdLayout}>
              {getFieldDecorator('startDate', {
                initialValue: null,
              })(<DatePicker showTime placeholder="请输入" onChange={this.onChangeStartTime} />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="结束时间" {...thirdLayout}>
              {getFieldDecorator('endDate', {
                initialValue: null,
              })(<DatePicker showTime placeholder="请输入" onChange={this.onChangeEndTime} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="请假类型" {...thirdLayout} hasFeedback>
              {getFieldDecorator('leaveType')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear onChange={this.selectTaskType}>
                  {this.props.leaveType.map((item) => {
                    return (
                      <Option key={item.id} value={item.ruleName}>
                        {item.ruleName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem
              label="审批状态"
              labelCol={{ xl: { span: 9 }, md: { span: 10 }, sm: { span: 12 }, xs: { span: 12 } }}
            >
              {getFieldDecorator('isFeedback', {
                initialValue: this.state.feedbalVal,
              })(
                <Radio.Group onChange={this.hangdleFeedback}>
                  <Radio value={true}>已通过</Radio>
                  <Radio value={false}>已撤销</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col> */}
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="目的地" {...thirdLayout}>
              {getFieldDecorator('destination', {
                initialValue: undefined,
              })(<Input placeholder="请输入" allowClear />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              清空
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handlePrif}>
              导出
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const InfoSearch = Form.create()(SearchForm);
export default InfoSearch;
