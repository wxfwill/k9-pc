import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Radio, TreeSelect, Select, DatePicker} from 'antd';
import moment from 'moment';
import GlobalName from 'components/searchForm/GlobalUserName';
import GlobalTeam from 'components/searchForm/GlobalTeam';
import GlobalTaskType from 'components/searchForm/GlobalTaskType';
import GlobalSatrtEndTime from 'components/searchForm/GlobalSatrtEndTime';
const FormItem = Form.Item;
const {TreeNode} = TreeSelect;
const Option = Select.Option;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbalVal: null
    };
  }
  componentDidMount() {}
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
      [name]: value
    });
  }
  onChangeStartTime = () => {};
  hangdleFeedback = () => {};
  handlePrif = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.handleExportData && this.props.handleExportData(values);
    });
  };
  render() {
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <GlobalTeam form={this.props.form} teamLabel="groupIds"></GlobalTeam>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <GlobalName form={this.props.form} userLabel="userIds"></GlobalName>
          </Col>
          <GlobalSatrtEndTime form={this.props.form}></GlobalSatrtEndTime>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <GlobalTaskType form={this.props.form} taskCode="jxType" taskLabel="rewardType"></GlobalTaskType>
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
  }
}

const InfoSearch = Form.create()(SearchForm);
export default InfoSearch;
