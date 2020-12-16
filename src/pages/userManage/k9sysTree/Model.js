import React, { Component } from 'react';
import { Modal, Button, InputNumber, Select, Row, Col, Form, Input } from 'antd';
import { editModel } from 'util/Layout';
const { TextArea } = Input;
const Option = Select.Option;

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      name: undefined,
      code: undefined,
      sn: 1,
      mark: undefined,
      isSys: 0,
      isSysTree: false,
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  openModel = (item) => {
    this.setState({ visible: true });
    if (item == 'root') {
      // 根节点
      this.reset();
      this.setState({ isSysTree: false });
    } else if (typeof item == 'string') {
      // 新增
      this.reset();
      this.setState({ isSysTree: true, isSys: null });
    } else {
      // 编辑
      let { name, code, isSys, mark, sn, pid } = item;
      // if (pid == 0) {

      // }
      this.setState({ name, code, isSys, mark, sn, isSysTree: pid == 0 ? false : true });
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
      name: undefined,
      code: undefined,
      sn: 1,
      mark: undefined,
      isSys: 0,
    });
  };
  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({ visible: false });
  };
  selectTaskType = () => {};
  handleSubmit = () => {};
  onChangeTextArea = () => {};
  handleChangeNum = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
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
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleSubmit} {...editModel}>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="名称">
                {getFieldDecorator('name', {
                  initialValue: this.state.name,
                  rules: [{ required: true, message: '请输入树名称' }],
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="别名">
                {getFieldDecorator('code', {
                  initialValue: this.state.code,
                  rules: [{ required: true, message: '请输入别名' }],
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="排序">
                {getFieldDecorator('sn', {
                  initialValue: this.state.sn,
                })(<InputNumber min={1} max={100} style={{ width: '100%' }} onChange={this.handleChangeNum} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="描述">
                {getFieldDecorator('mark', {
                  initialValue: this.state.mark,
                })(<TextArea placeholder="描述" allowClear autoSize={{ minRows: 3, maxRows: 6 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start" style={{ display: this.state.isSysTree ? 'none' : 'block' }}>
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="是否内部树">
                {getFieldDecorator('isSys', {
                  initialValue: this.state.isSys,
                  rules: [{ required: false, message: '请选择是否启用' }],
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} disabled={this.state.isSysTree} allowClear>
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
        </Form>
      </Modal>
    );
  }
}

const EditForm = Form.create({ name: 'EditModelTree' })(ShowModel);

export default EditForm;
