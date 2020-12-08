import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, TreeSelect, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import { withRouter, Link } from 'react-router-dom';
import { Debounce } from 'libs/util/index.js';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

const { MonthPicker } = DatePicker;
const { TreeNode } = TreeSelect;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      teamVal: util.urlParse(this.props.location.search)
        ? util.urlParse(this.props.location.search).groupId
        : undefined,
      userId: util.urlParse(this.props.location.search) ? util.urlParse(this.props.location.search).userId : undefined,
      isopen: false,
      nameVal: undefined,
      checkYear: false,
      checkMonth: false,
      teamData: [],
      userData: [],
      queryName: [],
      personnelTree: [],
    };
  }
  componentDidMount() {
    let { isShowTeam, isShowName } = this.props;
    if (isShowTeam) {
      this.queryAllTeam();
    }
    if (isShowName) {
      this.queryGroupUser('');
    }

    // 是否下站过阿莱
    if (JSON.stringify(util.urlParse(this.props.location.search)) != '{}') {
      this.handleSearch();
    }
  }
  handleSearch = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ checkYear: false });
        this.props.handleSearchData && this.props.handleSearchData(values, () => false);
      }
    });
  };
  handeExport = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.setState({ checkYear: false });
        this.props.handeExport && this.props.handeExport(values);
      }
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ checkYear: false });
    this.props.form.setFieldsValue({ year: null });
    this.setState({ teamVal: undefined, userId: undefined });
    this.props.handleReset && this.props.handleReset();
  };
  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  selectHouseId = () => {};
  onChangeMonth = (ev) => {
    if (ev && moment(ev).format('M') && !this.props.form.getFieldValue('year')) {
      this.setState({ checkYear: true });
    } else {
      this.setState({ checkYear: false });
    }
  };
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
  queryGroupUser = Debounce(
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
    false
  );
  onChangeYear = (time) => {
    if (this.props.form.getFieldValue('month')) {
      this.setState({ checkYear: true }, () => {
        this.props.form.setFields({
          year: {
            value: null,
            error: [new Error('请选择年份')],
          },
        });
      });
    } else {
      this.setState({ checkYear: false });
    }
  };
  selectTaskType = () => {};
  hangdleFeedback = () => {};
  hangdleCatch = () => {};

  handleChangeName = (value) => {
    this.setState({ nameVal: value });
  };
  handleSearchName = (value) => {
    if (value) {
      this.queryBaseKey(value);
    } else {
      this.setState({ queryName: [] });
    }
  };
  handleTreeName = (val) => {
    console.log(val);
    console.log('valvalvalvalvalvalvalval');
  };
  handleFocus = () => {
    this.queryGroupUser('');
  };
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { isopen, time } = this.state;
    let { isShowTeam, isShowName } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          {isShowTeam ? (
            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
              <FormItem label="中队:" {...thirdLayout}>
                {getFieldDecorator('groupId', {
                  initialValue: this.state.teamVal,
                })(
                  <Select
                    placeholder="请选择"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    allowClear
                    onChange={this.selectHouseId}
                  >
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
          ) : null}
          {isShowName ? (
            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
              <FormItem label="姓名:" {...thirdLayout}>
                {getFieldDecorator('userId', {
                  initialValue: this.state.userId,
                })(
                  <TreeSelect
                    showSearch
                    dropdownClassName="cutomTreeSelect"
                    style={{ width: '100%' }}
                    filterTreeNode={() => true}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    onSearch={(value) => {
                      this.props.form.setFieldsValue({ userId: undefined });
                      this.queryGroupUser(value);
                    }}
                    onFocus={this.handleFocus}
                    onChange={this.handleTreeName}
                  >
                    {this.state.personnelTree && this.state.personnelTree.length > 0
                      ? this.state.personnelTree.map((item) => {
                          return (
                            <TreeNode
                              className="innerTreeNode"
                              value={item.name}
                              title={item.name}
                              key={item.name}
                              selectable={false}
                            >
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
          ) : null}

          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="年份" {...thirdLayout}>
              {getFieldDecorator('year', {
                initialValue: time,
                rules: [
                  {
                    required: this.state.checkYear,
                    message: '请选择年份',
                  },
                ],
              })(
                <DatePicker
                  mode="year"
                  open={isopen}
                  getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                  format="YYYY"
                  onOpenChange={(status) => {
                    if (status) {
                      this.setState({ isopen: true });
                    } else {
                      this.setState({ isopen: false });
                    }
                  }}
                  onPanelChange={(v) => {
                    this.setState({
                      time: v,
                      isopen: false,
                    });
                    setFieldsValue({ year: v });
                  }}
                  onChange={this.onChangeYear}
                  placeholder="请选择"
                />
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="月份" {...thirdLayout}>
              {getFieldDecorator('month', {
                initialValue: null,
                rules: [
                  {
                    required: this.state.checkMonth,
                    message: '请选择月份',
                  },
                ],
              })(
                <MonthPicker
                  placeholder="请选择"
                  getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                  format="MM"
                  onChange={this.onChangeMonth}
                />
              )}
            </FormItem>
          </Col>

          <Col xl={6} lg={6} md={6} sm={12} xs={12} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              清空
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handeExport}>
              导出
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const InfoSearch = Form.create()(SearchForm);
export default withRouter(InfoSearch);
