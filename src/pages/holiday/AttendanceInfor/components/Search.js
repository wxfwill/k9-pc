import React, {Component} from 'react';
import {Form, Row, Col, Button, TreeSelect, Select, DatePicker} from 'antd';
import {thirdLayout} from 'util/Layout';
import RequestTeamProps from './RequestTeamProps';
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
      userIds: void 0
    };
  }
  componentDidMount() {}
  handleTreeName = (val) => {};
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
      values.userIds = values.userIds ? [values.userIds] : values.userIds;
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
        values.userIds = values.userIds ? [values.userIds] : values.userIds;
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
                  <FormItem label="考勤状态:" {...thirdLayout}>
                    {getFieldDecorator('clockType')(
                      <Select
                        placeholder="请选择"
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        onChange={this.selectHouseId}>
                        {allTeam.map((item) => {
                          return (
                            <Option key={item.value} value={item.value}>
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
                      initialValue: this.state.userIds
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
                        //showTime
                        getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                        placeholder="请选择"
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
                        //showTime
                        placeholder="请选择"
                        getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                        onChange={this.onChangeEndTime}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
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
