import React, {Component} from 'react';
import {Modal, Form, Input, Radio, message, Select, InputNumber} from 'antd';
import * as localData from 'localData/performance/AssessmentSetting';
const {Option} = Select;
class AddRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ModalText: 'Content of the modal',
      visible: false,
      redactData: null,
      confirmLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      redactData: nextProps.redactData
    });
  }

  handleOk = () => {
    const {form, redactData, pid} = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let dataObj = null;
      if (redactData) {
        //编辑小类或大类
        const ruleName = values.ruleName;
        const ruleCode = values.ruleCode;
        const sn = values.sn;

        const ruleCycle = values.ruleCycle;
        const integralLimit = values.integralLimit;
        const operation = values.operation;
        const baseScore = values.baseScore;
        dataObj =
          this.props.title === '大类'
            ? {...redactData, ruleName, ruleCode, sn}
            : {...redactData, ruleName, ruleCode, sn, ruleCycle, integralLimit, operation, baseScore};
      } else {
        const scoreType = 'base'; //区分单个分数 和 区间分数，目前写死为单个分数
        //新增小类或大类
        dataObj = pid ? {...values, scoreType, pid} : {...values, scoreType};
      }
      React.$ajax
        .postData('/api/integral-rule/create', dataObj)
        .then((res) => {
          if (res.code == 0) {
            this.handleCancel();
            const timer = setTimeout(() => {
              message.success('操作成功');
              clearTimeout(timer);
            });
          }
        })
        .catch((error) => {
          message.error(error.msg);
        });
    });
  };

  handleCancel = () => {
    const {form, closeAddRule} = this.props;
    form.resetFields();
    closeAddRule();
  };

  render() {
    const {visible, confirmLoading, ModalText, redactData} = this.state;
    const {title, form} = this.props;
    const {getFieldDecorator} = form;
    const _title = redactData ? '编辑' : '添加';
    return (
      <Modal
        title={_title + title}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}>
        {title === '大类' ? (
          <Form>
            <Form.Item label="名称">
              {getFieldDecorator('ruleName', {
                rules: [{required: true, message: '请填写名称!'}],
                initialValue: redactData ? redactData.ruleName : ''
              })(<Input />)}
            </Form.Item>
            <Form.Item label="别名">
              {getFieldDecorator('ruleCode', {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9a-zA-Z]{1,32}$/g),
                    message: '请填写别名，别名只能填写字母和数字，长度1-32位!'
                  }
                ],
                initialValue: redactData ? redactData.ruleCode : ''
              })(<Input />)}
            </Form.Item>
            <Form.Item label="排序">
              {getFieldDecorator('sn', {
                rules: [{required: true, message: '请填写排序!'}],
                initialValue: redactData ? redactData.sn : 0
              })(<InputNumber min={0} style={{width: '100%'}} />)}
            </Form.Item>
          </Form>
        ) : (
          <Form>
            <Form.Item label="名称">
              {getFieldDecorator('ruleName', {
                rules: [{required: true, message: '请填写名称!'}],
                initialValue: redactData ? redactData.ruleName : ''
              })(<Input />)}
            </Form.Item>
            <Form.Item label="别名">
              {getFieldDecorator('ruleCode', {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9a-zA-Z]{1,32}$/g),
                    message: '请填写别名，别名只能填写字母和数字，长度1-32位!'
                  }
                ],
                initialValue: redactData ? redactData.ruleCode : ''
              })(<Input />)}
            </Form.Item>
            <Form.Item label="排序">
              {getFieldDecorator('sn', {
                rules: [{required: true, message: '请填写排序!'}],
                initialValue: redactData ? redactData.sn : 0
              })(<InputNumber min={0} style={{width: '100%'}} />)}
            </Form.Item>
            <Form.Item label="周期">
              {getFieldDecorator('ruleCycle', {
                rules: [{required: true, message: '请选择周期!'}],
                initialValue: redactData ? redactData.ruleCycle : 'everyTime'
              })(
                <Select style={{width: '100%'}}>
                  {localData.IntegralRuleCycleEnum && localData.IntegralRuleCycleEnum.length > 0
                    ? localData.IntegralRuleCycleEnum.map((item) => {
                        return (
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        );
                      })
                    : null}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="周期内积分限制">
              {getFieldDecorator('integralLimit', {
                //rules: [{ required: true, message: '请填写周期内积分限制!' }],
                initialValue: redactData ? redactData.integralLimit : null
              })(<InputNumber min={0} max={100} style={{width: '100%'}} />)}
            </Form.Item>
            <Form.Item label="积分操作">
              {getFieldDecorator('operation', {
                rules: [{required: true, message: '请选择积分操作!'}],
                initialValue: redactData ? redactData.operation : 'add'
              })(
                <Radio.Group>
                  {localData.IntegralOperationEnum && localData.IntegralOperationEnum.length > 0
                    ? localData.IntegralOperationEnum.map((item) => {
                        return (
                          <Radio value={item.value} key={item.value}>
                            {item.label}
                          </Radio>
                        );
                      })
                    : null}
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="分数">
              {getFieldDecorator('baseScore', {
                rules: [{required: true, message: '请填写分数!'}],
                initialValue: redactData ? redactData.baseScore : 0
              })(<InputNumber min={0} max={100} style={{width: '100%'}} />)}
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

const AddRuleForm = Form.create({name: 'AddRule'})(AddRule);

export default AddRuleForm;
