import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Radio, TreeSelect, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import RequestTeamProps from '../../reportManage/Common/RequestTeamProps';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { TreeNode } = TreeSelect;

const { MonthPicker } = DatePicker;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personnelTree: [],
      taskTypeList: [],
      feedbalVal: null,
      successVal: null,
    };
  }
  componentDidMount() {
    // 查询用户
    this.queryGroupUser('');
    // 任务类型
    this.queryTaskType('4w报备');
  }
  handleTreeName = (val) => {
    console.log(val);
    console.log('valvalvalvalvalvalvalval');
  };
  handleTaskName = (val) => {
    console.log('任务类型');
    console.log(val);
  };
  queryTaskType = (rootName) => {
    React.$ajax.common.queryRulesByRootName({ rootName }).then((res) => {
      if (res.code == 0) {
        this.setState({ taskTypeList: res.data });
      }
    });
  };
  queryGroupUser = util.Debounce(
    (keyword) => {
      React.$ajax.common.queryGroupUser({ keyword }).then((res) => {
        if (res.code == 0) {
          let resObj = res.data;
          let arr = [];
          for (let key in resObj) {
            if (resObj[key] && resObj[key].length > 0) {
              arr.push({
                name: key,
                children: resObj[key],
              });
            }
          }
          this.setState({ personnelTree: arr });
        }
      });
    },
    200,
    true
  );
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.handleSearchData && this.props.handleSearchData(values, () => false);
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearchData && this.props.handleSearchData(null, () => false);
  };
  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  onChangeMonth = () => {};
  selectHouseId = () => {};
  onChangeStartTime = () => {};
  onChangeEndTime = () => {};
  selectTaskType = () => {};
  hangdleFeedback = () => {};
  hangdleCatch = () => {};
  handlePrif = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.exportExcel && this.props.exportExcel(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <RequestTeamProps
        render={(data) => {
          let allTeam = data && data.teamData;
          return (
            <Form onSubmit={this.handleSearch}>
              <Row gutter={24}>
                <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                  <FormItem label="中队:" {...thirdLayout}>
                    {getFieldDecorator('groupId')(
                      <Select
                        placeholder="请选择"
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        onChange={this.selectHouseId}
                      >
                        {allTeam.map((item) => {
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
                    {getFieldDecorator('userId')(
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        filterTreeNode={() => true}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择"
                        allowClear
                        onSearch={(value) => {
                          this.queryGroupUser(value);
                        }}
                        onChange={this.handleTreeName}
                      >
                        {this.state.personnelTree && this.state.personnelTree.length > 0
                          ? this.state.personnelTree.map((item) => {
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
                  </FormItem>
                </Col>
                <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                  {/* <FormItem label="考核时间" {...thirdLayout}>
                    {getFieldDecorator('repDateStart', {
                      initialValue: null,
                    })(
                      <DatePicker
                        getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                        placeholder="请输入"
                        onChange={this.onChangeStartTime}
                      />
                    )}
                  </FormItem> */}

                  <FormItem label="考核时间" {...thirdLayout}>
                    {getFieldDecorator('month', {
                      initialValue: null,
                    })(
                      <MonthPicker
                        placeholder="请选择"
                        getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                        format="YYYY-MM"
                        onChange={this.onChangeMonth}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                  <FormItem
                    label="是否提交自评表"
                    labelCol={{ xl: { span: 9 }, md: { span: 10 }, sm: { span: 12 }, xs: { span: 12 } }}
                  >
                    {getFieldDecorator('submitState', {
                      initialValue: null,
                    })(
                      <Radio.Group onChange={this.hangdleFeedback}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col xl={8} lg={8} md={10} sm={12} xs={12}>
                  <FormItem
                    label="审批状态"
                    labelCol={{ xl: { span: 6 }, md: { span: 6 }, sm: { span: 12 }, xs: { span: 12 } }}
                  >
                    {getFieldDecorator('approvalState', {
                      initialValue: null,
                    })(
                      <Radio.Group onChange={this.hangdleCatch}>
                        <Radio value={1}>未审批</Radio>
                        <Radio value={2}>审批中</Radio>
                        <Radio value={3}>已完成</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
                <Col xl={5} lg={5} md={8} sm={12} xs={12}>
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
        }}
      ></RequestTeamProps>
    );
  }
}

const InfoSearch = Form.create()(SearchForm);
export default InfoSearch;
