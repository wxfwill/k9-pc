import React, {Component} from 'react';
import {Modal, Button, Cascader, Select, Row, Col, Form, Input} from 'antd';
import {editModel} from 'util/Layout';
const {TextArea} = Input;
const Option = Select.Option;
class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      roleCode: null,
      roleName: null,
      roleType: ['role', 'role_default'],
      description: undefined,
      id: 0,
      cascaderData: [],
      fieldName: {
        label: 'name',
        value: 'code',
        children: 'children'
      }
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    this.queryRoleType();
  }
  // 角色分类
  queryRoleType = () => {
    const per = {
      code: 'role',
      type: 'slfAndChild'
    };
    React.$ajax.postData('/api/sys/sys-tree/queryTree', per).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        const resData = res.data;
        console.log(resData);
        this.setState({cascaderData: resData});
      }
    });
  };
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };
  openModel = (item) => {
    this.setState({visible: true});
    if (item) {
      let {roleCode, roleName, roleType, description} = item;
      console.log(roleType);
      const _roleType = roleType.split('_')[0];
      roleType = [_roleType, roleType];
      console.log(roleType);
      this.setState({roleCode, roleName, roleType, description});
    } else {
      this.setState({
        roleName: undefined,
        roleCode: undefined,
        roleType: ['role', 'role_default'],
        description: undefined
      });
    }
  };
  handleOk = () => {
    this.props.form.validateFields((err, val) => {
      if (!err) {
        this.props.handleFromData && this.props.handleFromData(val);
      }
    });
  };
  handleCancel = () => {
    this.setState({visible: false});
    this.props.form.resetFields();
  };
  selectTaskType = () => {};
  handleSubmit = () => {};
  handleRoleChange = (val) => {
    console.log(val);
  };
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        wrapClassName="customModel"
        title={this.props.title}
        visible={this.state.visible}
        width={'560px'}
        centered={false}
        destroyOnClose={false}
        maskClosable={false}
        okText={'保存'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <Form onSubmit={this.handleSubmit} {...editModel}>
          <Row type="flex" justify="center">
            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
              <Form.Item label="角色分类">
                {getFieldDecorator('roleType', {
                  initialValue: this.state.roleType,
                  rules: [{required: true, message: '请选择角色分类'}]
                })(
                  <Cascader
                    fieldNames={this.state.fieldName}
                    changeOnSelect={false}
                    displayRender={(label, option) => {
                      const len = label.length;
                      return label[len - 1];
                    }}
                    options={this.state.cascaderData}
                    onChange={this.handleRoleChange}
                    placeholder="请选择"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
              <Form.Item label="角色名称">
                {getFieldDecorator('roleName', {
                  initialValue: this.state.roleName,
                  rules: [{required: true, message: '请选择角色名称'}]
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
              <Form.Item label="角色编码">
                {getFieldDecorator('roleCode', {
                  initialValue: this.state.roleCode,
                  rules: [{required: true, message: '请选择角色编码'}]
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
              <Form.Item label="描述">
                {getFieldDecorator('description', {
                  initialValue: this.state.description
                })(
                  <TextArea
                    placeholder="请输入"
                    allowClear
                    style={{width: '100%'}}
                    autoSize={{minRows: 2, maxRows: 6}}
                  />
                )}
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
