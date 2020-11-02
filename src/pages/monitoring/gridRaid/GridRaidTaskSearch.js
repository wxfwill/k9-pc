import React, { Component } from "react";
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from "antd";
import { thirdLayout } from "components/view/common/Layout";
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
import moment from "moment";
const Option = Select.Option;

require("style/view/common/conduct.less");
class SearchForm extends React.Component {
  state = {
    expand: true,
    taskName: "",
  };
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    let timeData = "range-time-picker";
    this.props.form.validateFields((err, fieldsValue) => {
      const rangeTimeValue = fieldsValue["range-time-picker"];
      let rangeValueArr = ["", ""];
      if (!(typeof rangeTimeValue == "undefined" || rangeTimeValue.length == 0)) {
        rangeValueArr = [rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"), rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss")];
      }
      const values = {
        ...fieldsValue,
        "range-time-picker": rangeValueArr,
      };
      typeof values.taskName == "undefined" ? (values.taskName = "") : "";
      let subData = {
        startDate: values[timeData][0] && moment(values[timeData][0]).format("x"),
        endDate: values[timeData][1] && moment(values[timeData][1]).format("x"),
        taskName: values.taskName,
      };
      limit(subData);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };
  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  render() {
    let expand = this.state.expand;
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: "array", message: "Please select time!" }],
    };
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <FormItem label="时间范围" {...thirdLayout}>
              {getFieldDecorator("range-time-picker", rangeConfig)(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
            </FormItem>
          </Col>
          <Col xxl={8} xl={8} lg={12} md={24} sm={24} xs={24}>
            <FormItem label={"任务名称"} {...thirdLayout}>
              {getFieldDecorator("taskName")(<Input placeholder="任务名称" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              <Icon type="search" />
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              <Icon type="rollback" />
              清空
            </Button>
            {/*     <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '展开' : '收起'}  <Icon type={this.state.expand ? 'down': 'up' } />
            </a> */}
          </Col>
        </Row>
      </Form>
    );
  }
}

const GridRaidTaskSearch = Form.create()(SearchForm);

export default GridRaidTaskSearch;
