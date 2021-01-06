import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Radio, TreeSelect, Select, DatePicker} from 'antd';
import {thirdLayout} from 'util/Layout';
import RequestTeamProps from '../Common/RequestTeamProps';
const FormItem = Form.Item;
const Option = Select.Option;
const {TreeNode} = TreeSelect;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personnelTree: [],
      taskTypeList: [],
      feedbalVal: null,
      successVal: null,
      userId: undefined
    };
  }
  componentDidMount() {
    // 查询用户
    // this.queryGroupUser('');
    // 任务类型
    // this.queryTaskType('4w报备');
  }
  handleTreeName = (val) => {
    console.log(val);
    console.log('valvalvalvalvalvalvalval');
  };
  handleFocus = () => {
    this.props.queryGroupUser && this.props.queryGroupUser('', 'all');
  };
  handleTaskName = (val) => {
    console.log('任务类型');
    console.log(val);
  };
  queryTaskType = (rootName) => {
    React.$ajax.common.queryRulesByRootName({rootName}).then((res) => {
      if (res.code == 0) {
        this.setState({taskTypeList: res.data});
      }
    });
  };
  queryGroupUser = util.Debounce(
    (keyword) => {
      React.$ajax.common.queryGroupUser({keyword}).then((res) => {
        if (res.code == 0) {
          const resObj = res.data;
          const arr = [];
          for (const key in resObj) {
            if (resObj[key] && resObj[key].length > 0) {
              arr.push({
                name: key,
                children: resObj[key]
              });
            }
          }
          this.setState({personnelTree: arr});
        }
      });
    },
    200,
    true
  );
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      this.props.handleSearchData && this.props.handleSearchData(values, () => false);
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearchData && this.props.handleSearchData(null, () => false);
  };
  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  }
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
    const {getFieldDecorator} = this.props.form;
    return (
      <RequestTeamProps
        render={(data) => {
          const allTeam = data && data.teamData;
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
                        onChange={this.selectHouseId}>
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
                    {getFieldDecorator('userId', {
                      initialValue: this.state.userId
                    })(
                      <TreeSelect
                        showSearch
                        dropdownClassName="cutomTreeSelect"
                        style={{width: '100%'}}
                        filterTreeNode={() => true}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="请选择"
                        allowClear
                        onSearch={(value) => {
                          this.props.queryGroupUser && this.props.queryGroupUser(value);
                        }}
                        onFocus={this.handleFocus}
                        onChange={this.handleTreeName}>
                        {this.props.personnelTree && this.props.personnelTree.length > 0
                          ? this.props.personnelTree.map((item) => {
                              return (
                                <TreeNode
                                  className="innerTreeNode"
                                  value={item.name}
                                  title={item.name}
                                  key={item.name}
                                  selectable={false}>
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
                  <FormItem label="开始时间" {...thirdLayout}>
                    {getFieldDecorator('startDate', {
                      initialValue: null
                    })(
                      <DatePicker
                        showTime
                        getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                        placeholder="请输入"
                        onChange={this.onChangeStartTime}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                  <FormItem label="结束时间" {...thirdLayout}>
                    {getFieldDecorator('endDate', {
                      initialValue: null
                    })(
                      <DatePicker
                        showTime
                        placeholder="请输入"
                        getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                        onChange={this.onChangeEndTime}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                  <FormItem label="用车类型" {...thirdLayout} hasFeedback>
                    {getFieldDecorator('taskType')(
                      <TreeSelect
                        dropdownClassName="cutomTreeSelect"
                        style={{width: '100%'}}
                        filterTreeNode={() => true}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="请选择"
                        // treeCheckStrictly={true}
                        // treeExpandedKeys
                        allowClear
                        onChange={this.handleTaskName}>
                        {this.props.taskTypeList && this.props.taskTypeList.length > 0
                          ? this.props.taskTypeList.map((item) => {
                              return (
                                <TreeNode
                                  className="innerTreeNode"
                                  value={item.id}
                                  title={item.ruleName}
                                  key={item.ruleName}
                                  selectable={false}>
                                  {item.children && item.children.length > 0
                                    ? item.children.map((el) => {
                                        return <TreeNode value={el.id} title={el.ruleName} key={el.id} />;
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
                {/* <Col xl={4} lg={4} md={8} sm={12} xs={12}>
                  <FormItem
                    label="是否反馈"
                    labelCol={{ xl: { span: 9 }, md: { span: 10 }, sm: { span: 12 }, xs: { span: 12 } }}
                  >
                    {getFieldDecorator('isFeedback', {
                      initialValue: this.state.feedbalVal,
                    })(
                      <Radio.Group onChange={this.hangdleFeedback}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col> */}
                {/* <Col xl={4} lg={4} md={8} sm={12} xs={12}>
                  <FormItem
                    label="是否抓捕成功"
                    labelCol={{ xl: { span: 9 }, md: { span: 10 }, sm: { span: 12 }, xs: { span: 12 } }}
                  >
                    {getFieldDecorator('arrest', {
                      initialValue: this.state.successVal,
                    })(
                      <Radio.Group onChange={this.hangdleCatch}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col> */}
                <Col xl={4} lg={4} md={8} sm={12} xs={12}>
                  <FormItem label="目的地" {...thirdLayout}>
                    {getFieldDecorator('carDest', {
                      initialValue: ''
                    })(<Input placeholder="请输入" allowClear />)}
                  </FormItem>
                </Col>
                <Col xl={6} lg={6} md={8} sm={12} xs={12} style={{textAlign: 'center'}}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                    清空
                  </Button>
                  <Button style={{marginLeft: 8}} onClick={this.handlePrif}>
                    导出
                  </Button>
                </Col>
              </Row>
            </Form>
          );
        }}></RequestTeamProps>
    );
  }
}

const InfoSearch = Form.create()(SearchForm);
export default InfoSearch;
