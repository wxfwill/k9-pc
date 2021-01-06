import React, {Component} from 'react';
import {Modal, InputNumber, Select, Row, Col, Form, Input} from 'antd';
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
      url: undefined,
      tabCode: undefined,
      available: undefined,
      permission: undefined,
      icon: undefined,
      sort: 1,
      type: undefined,
      isdisMenu: false
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    this.queryMenuType();
  }
  // 菜单类型
  queryMenuType = () => {
    React.$ajax.getData('/api/sys/sys-module/queryMenuType').then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        const arr = [{key: 'root', title: '根节点'}];
        const resData = res.data;
        for (const key in resData) {
          arr.unshift({key, title: resData[key]});
        }
        this.setState({taksTypeData: arr});
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
      let {name, url, tabCode, type, sort, permission, available, icon} = item;
      console.log(item.icon);
      available = available == true ? 1 : 0;
      if (type == 'root') {
        this.setState({name, url, tabCode, type, sort, permission, available, icon, isdisMenu: true});
      } else {
        console.log(icon);
        this.setState({name, url, tabCode, type, sort, permission, available, icon: icon, isdisMenu: false});
      }
    } else {
      this.props.form.resetFields();
      this.setState({
        name: undefined,
        url: undefined,
        tabCode: undefined,
        type: undefined,
        sort: undefined,
        icon: undefined,
        permission: undefined,
        available: undefined,
        isdisMenu: false
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
  handleInputChange = (val) => {
    this.setState({icon: val.currentTarget.value});
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
    const {getFieldDecorator, getFieldValue} = this.props.form;
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
              <Form.Item label="菜单名称">
                {getFieldDecorator('name', {
                  initialValue: this.state.name,
                  rules: [{required: true, message: '请输入菜单名称'}]
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="菜单URL">
                {getFieldDecorator('url', {
                  initialValue: this.state.url,
                  rules: [{required: false, message: '请输入菜单url'}]
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="菜单类型">
                {getFieldDecorator('type', {
                  initialValue: this.state.type,
                  rules: [{required: true, message: '请选择菜单类型'}]
                })(
                  <Select
                    placeholder="请选择"
                    style={{width: '100%'}}
                    allowClear
                    onChange={this.selectTaskType}
                    disabled={this.state.isdisMenu}>
                    {this.state.taksTypeData.map((item) => {
                      return (
                        <Option key={item.key} value={item.key} disabled={item.key == 'root'}>
                          {item.title}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="是否启用">
                {getFieldDecorator('available', {
                  initialValue: this.state.available,
                  rules: [{required: true, message: '请选择是否启用'}]
                })(
                  <Select placeholder="请选择" style={{width: '100%'}} allowClear>
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
              <Form.Item label="图标">
                {getFieldDecorator('icon', {
                  initialValue: this.state.icon
                })(
                  // <Input placeholder="请输入" disabled={getFieldValue('type') == 'dir' ? false : true} />
                  <div className="icon_wrap">
                    <Input
                      placeholder="请输入"
                      value={this.state.icon}
                      onChange={this.handleInputChange}
                      disabled={getFieldValue('type') != 'dir'}
                    />
                    <span className="icon_tip">
                      提示：图标请参考antd的Icon.
                      <a target="_blank" href="https://3x.ant.design/components/icon-cn/">
                        链接
                      </a>
                    </span>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="页签标识">
                {getFieldDecorator('tabCode', {
                  initialValue: this.state.tabCode
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="权限码">
                {getFieldDecorator('permission', {
                  initialValue: this.state.permission
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="排序">
                {getFieldDecorator('sort', {
                  initialValue: this.state.sort
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
