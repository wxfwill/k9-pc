import React, {Component} from 'react';
import {Modal, Cascader, InputNumber, Select, Row, Col, Form, Input} from 'antd';
import {editModel} from 'util/Layout';
const Option = Select.Option;

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      startValue: null,
      endValue: null,
      endOpen: false,
      taksTypeData: [],
      name: undefined,
      num: undefined,
      orgType: undefined,
      sn: 1,
      code: undefined,
      fieldName: {
        label: 'name',
        value: 'code',
        children: 'children'
      }
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    this.queryOrganType();
  }
  // 机构类型
  queryOrganType = () => {
    const per = {
      code: 'org_type',
      type: 'slfAndChild'
    };
    React.$ajax.postData('/api/sys/sys-tree/queryTree', per).then((res) => {
      if (res && res.code == 0) {
        const resData = res.data;
        console.log(resData);
        this.setState({taksTypeData: resData});
      }
    });
  };
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
      console.log(item);
      let {name, num, orgType, code, sn} = item;
      if (orgType) {
        const _orgType = orgType.split('_')[0] + '_' + orgType.split('_')[1];
        orgType = [_orgType, orgType];
      } else {
        orgType = undefined;
      }

      console.log(orgType);
      this.setState({name, num, orgType, code, sn});
    } else {
      this.props.form.resetFields();
      this.setState({
        name: undefined,
        num: undefined,
        orgType: undefined,
        sn: undefined,
        code: undefined
      });
    }
  };
  handleOk = () => {
    this.props.form.validateFields((err, val) => {
      console.log(val);
      if (!err) {
        this.props.editFormData && this.props.editFormData(val);
      }
    });
  };
  handleRoleChange = (val) => {
    console.log(val);
  };
  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({visible: false});
  };
  selectTaskType = () => {};
  handleSubmit = () => {};
  onChangeTextArea = () => {};
  handleChangeNum = () => {};
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
              <Form.Item label="机构名称">
                {getFieldDecorator('name', {
                  initialValue: this.state.name,
                  rules: [{required: true, message: '请输入机构名称'}]
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="机构编码">
                {getFieldDecorator('num', {
                  initialValue: this.state.num,
                  rules: [{required: true, message: '请输入机构编码'}]
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="机构标识">
                {getFieldDecorator('code', {
                  initialValue: this.state.code,
                  rules: [{required: true, message: '请输入机构标识'}]
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="机构类型">
                {getFieldDecorator('orgType', {
                  initialValue: this.state.orgType,
                  rules: [{required: true, message: '请选择机构类型'}]
                })(
                  <Cascader
                    fieldNames={this.state.fieldName}
                    changeOnSelect={false}
                    displayRender={(label, option) => {
                      const len = label.length;
                      return label[len - 1];
                    }}
                    options={this.state.taksTypeData}
                    onChange={this.handleRoleChange}
                    placeholder="请选择"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="排序">
                {getFieldDecorator('sn', {
                  initialValue: this.state.sn
                })(<InputNumber min={1} max={100} style={{width: '100%'}} onChange={this.handleChangeNum} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const EditForm = Form.create({name: 'EditModel'})(ShowModel);

export default EditForm;
