import React, {Component} from 'react';
import {Modal, Button, InputNumber, Select, Row, Col, Form, Input} from 'antd';
import {editModel} from 'util/Layout';
const {TextArea} = Input;
const Option = Select.Option;

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pname: undefined,
      pvalue: undefined,
      remark: undefined,
      isSys: undefined
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open});
  };

  openModel = (item) => {
    this.setState({visible: true});

    if (item) {
      // 编辑
      const {pname, pvalue, remark, isSys} = item;
      this.setState({pname, pvalue, remark, isSys});
    } else {
      // 新增
      this.reset();
    }
  };
  handleOk = () => {
    this.props.form.validateFields((err, val) => {
      if (!err) {
        this.props.handleFormData && this.props.handleFormData(val);
      }
    });
  };
  reset = () => {
    this.setState({
      pname: undefined,
      pvalue: undefined,
      remark: undefined,
      isSys: undefined
    });
  };
  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({visible: false});
  };
  handleSubmit = () => {};
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        wrapClassName="customModel"
        title={this.props.type}
        visible={this.state.visible}
        width={'50%'}
        centered={false}
        destroyOnClose={false}
        maskClosable={false}
        okText={'保存'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <Form onSubmit={this.handleSubmit} {...editModel}>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="参数名">
                {getFieldDecorator('pname', {
                  initialValue: this.state.pname,
                  rules: [{required: true, message: '请输入标题'}]
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="参数值">
                {getFieldDecorator('pvalue', {
                  initialValue: this.state.pvalue,
                  rules: [{required: true, message: '请输入'}]
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="是否系统内置">
                {getFieldDecorator('isSys', {
                  initialValue: this.state.isSys,
                  rules: [{required: true, message: '请选择是否启用'}]
                })(
                  <Select placeholder="请选择" style={{width: '100%'}} disabled={false} allowClear>
                    <Option key={1} value={1}>
                      是
                    </Option>
                    <Option key={1} value={0}>
                      否
                    </Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="备注">
                {getFieldDecorator('remark', {
                  initialValue: this.state.remark
                })(<TextArea placeholder="备注" allowClear autoSize={{minRows: 3, maxRows: 6}} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const EditForm = Form.create({name: 'EditModelTree'})(ShowModel);

export default EditForm;
