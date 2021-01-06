import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select} from 'antd';
import {thirdLayout} from 'util/Layout';
import httpAjax from 'libs/httpAjax';
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    expand: true,
    trainType: '',
    trainLevel: '',
    typeOption: [],
    LevelOption: []
  };
  componentWillMount() {
    const _this = this;
    //let typeOption = httpAjax('post',config.apiUrl+'/api/trainingSubject/getAllTrainType');
    const LevelOption = httpAjax('post', config.apiUrl + '/api/trainingSubject/getAllTrainLevel');
    /*Promise.all([typeOption,LevelOption]).then((resArr)=>{
      _this.setState({
        typeOption:resArr[0].data,
        LevelOption:resArr[1].data,
      })
    })*/
    Promise.all([LevelOption]).then((resArr) => {
      _this.setState({
        LevelOption: resArr[0].data
      });
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    const {limit} = this.props;
    this.props.form.validateFields((err, values) => {
      Object.keys(values).forEach(function (item, index) {
        typeof values[item] === 'undefined' ? (values[item] = '') : '';
      });
      limit(values);
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  toggle = () => {
    const {expand} = this.state;
    this.setState({expand: !expand});
  };
  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  }
  render() {
    const expand = this.state.expand;
    const {getFieldDecorator} = this.props.form;
    const optionArr = ['初级', '中级', '高级'];
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label={'训练科目'} {...thirdLayout}>
              {getFieldDecorator('trainSubjectName')(<Input placeholder="训练科目" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label={'训练阶段'} {...thirdLayout}>
              {getFieldDecorator('trainLevel')(
                <Select placeholder="训练阶段">
                  {this.state.LevelOption.map((item, index) => {
                    if (item.trainLevel == '') {
                      return (
                        <Option key={item.trainLevel} value={item.trainLevel}>
                          全部
                        </Option>
                      );
                    } else {
                      return (
                        <Option key={item.trainLevel} value={item.trainLevel}>
                          {optionArr[item.trainLevel - 1]}
                        </Option>
                      );
                    }
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>
              清空
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const SubSearch = Form.create()(SearchForm);

export default SubSearch;

// WEBPACK FOOTER //
// ./src/components/view/searchForm/drill/SubSearch.js
