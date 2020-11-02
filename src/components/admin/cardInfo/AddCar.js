import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload, message, Modal } from 'antd';
import { firstLayout, secondLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
require('style/app/dogInfo/addDogForm.less');
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;

class VideoInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInitialValue: false,
      disabled: false,
    };
  }

  handleSubmit = () => {
    const { code, playUrl, remark, userName, password } = this.state;
    const id = this.props.location.query && this.props.location.query.record && this.props.location.query.record.id;

    const successMess = id ? '修改成功' : '添加成功';
    const errorMess = id ? '修改失败' : '添加失败';
    let parms = {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        parms = { ...values };
        if (id) {
          parms.id = id;
        }
        httpAjax('post', config.apiUrl + '/api/material/saveCarInfo', parms)
          .then((res) => {
            if (res.code == 0) {
              this.props.history.push('/app/equipment/carInfo');
              message.success(successMess);
            } else {
              message.error(errorMess);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let record;
    if (this.props.location.query) {
      record = this.props.location.query.record;
    }
    // console.log(this.props,this.state, 'asdasdq',record )
    const { isInitialValue, disabled } = this.state;
    return (
      <div className="AddDogForm">
        <Row gutter={24}>
          <Col span={24}>
            <Card title="车辆信息" bordered={true}>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="品牌" {...secondLayout} hasFeedback>
                        {getFieldDecorator('brand', {
                          rules: [{ required: true, whitespace: true, message: '请输入车辆品牌' }],
                          initialValue: (record && record.brand) || '',
                        })(<Input placeholder="品牌" disabled={disabled} />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="车型" {...secondLayout} hasFeedback>
                        {getFieldDecorator('type', {
                          // rules:[{required:true,message:'请选择车类型'}],
                          initialValue: (record && record.type + '') || '',
                        })(
                          <Select>
                            <Option value="1">小车</Option>
                            <Option value="2">中车</Option>
                            <Option value="3">大车</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="车牌" {...secondLayout} hasFeedback>
                        {getFieldDecorator('number', {
                          rules: [{ required: true, message: '请输入车牌' }],
                          initialValue: (record && record.number + '') || '',
                        })(<Input placeholder="车牌" disabled={disabled} />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="车类型" {...secondLayout} hasFeedback>
                        {getFieldDecorator('useage', {
                          rules: [{ required: true, message: '请选择车类型' }],
                          initialValue: (record && record.useage + '') || '',
                        })(
                          <Select>
                            <Option value="1">运犬车</Option>
                            <Option value="2">公务车</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {
                    <Row gutter={24}>
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <FormItem label="备注" {...firstLayout}>
                          {getFieldDecorator('remark', {
                            // rules: [{ required: true,whitespace:true, message: '请输入档案编号' },{validator: this.checkNumber}],
                            initialValue: (record && record.remark) || '',
                          })(<TextArea placeholder="备注" autosize={{ minRows: 3, maxRows: 6 }} disabled={disabled} />)}
                        </FormItem>
                      </Col>
                    </Row>
                  }

                  {!disabled ? (
                    <Row>
                      <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
                          提交
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                          清空
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                </Form>
              </Col>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const AddViewForm = Form.create()(VideoInfo);

const mapStateToProps = (state) => ({
  loginState: state.login,
});
export default connect(mapStateToProps)(AddViewForm);

// WEBPACK FOOTER //
// ./src/components/admin/cardInfo/AddCar.js
