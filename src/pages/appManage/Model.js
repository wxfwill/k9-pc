import React, { Component } from 'react';
import { Modal, Button, InputNumber, Select, Row, Col, Form, Input } from 'antd';
import { editModel } from 'util/Layout';
import CustomUpload from 'components/Upload/index';
const { TextArea } = Input;
const Option = Select.Option;

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: undefined,
      openType: undefined,
      openTypeArr: [],
      sn: 1,
      openAddr: undefined,
      openParam: undefined,
      enabled: undefined,
      normalIcon: null,
      normalIconUrl: null,
      highlightIcon: null,
      highlightIconUrl: null,
      id: 0,
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    // 导航打开方式
    this.queryNavType();
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

    if (item) {
      // 编辑
      let {
        title,
        openType,
        openAddr,
        normalIcon,
        highlightIcon,
        highlightIconUrl,
        normalIconUrl,
        openParam,
        sn,
        enabled,
        id,
      } = item;
      console.log(normalIconUrl);
      this.setState({
        id,
        title,
        openType,
        normalIcon,
        highlightIcon,
        highlightIconUrl,
        normalIconUrl,
        openAddr,
        openParam,
        sn,
        enabled,
      });
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
      title: undefined,
      openType: undefined,
      sn: 1,
      openAddr: undefined,
      openParam: undefined,
      enabled: undefined,
      normalIcon: null,
      highlightIcon: null,
      highlightIconUrl: null,
      normalIconUrl: null,
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
  // 导航打开方式
  queryNavType = (callback) => {
    React.$ajax.getData('/api/sys-appNavigation/queryOpenType').then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        let arr = [],
          resData = res.data ? res.data : {};
        for (let key in resData) {
          resData[key] && arr.push({ label: key, val: resData[key] });
        }
        console.log(arr);
        this.setState({ openTypeArr: arr }, () => {
          callback && callback();
        });
      }
    });
  };
  getIconUrl = (msg, type) => {
    console.log(msg);
    console.log(type);
    if (type == 'default') {
      // this.props.form.setFields({ normalIcon: msg });
      this.setState({ normalIcon: msg }, () => {
        this.props.form.resetFields(['normalIcon']);
      });
    } else {
      // this.props.form.setFields({ highlightIcon: msg });
      this.setState({ highlightIcon: msg }, () => {
        this.props.form.resetFields(['highlightIcon']);
      });
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        wrapClassName="customModel"
        title={this.props.type}
        key={`default_${this.props.iconType}`}
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
              <Form.Item label="导航标题">
                {getFieldDecorator('title', {
                  initialValue: this.state.title,
                  rules: [{ required: true, message: '请输入标题' }],
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="导航打开方式">
                {getFieldDecorator('openType', {
                  initialValue: this.state.openType,
                  rules: [{ required: false, message: '请选择是否启用' }],
                })(
                  <Select
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    disabled={false}
                    allowClear
                  >
                    {this.state.openTypeArr && this.state.openTypeArr.length > 0
                      ? this.state.openTypeArr.map((item) => {
                          return (
                            <Option key={item.label} value={item.label}>
                              {item.val}
                            </Option>
                          );
                        })
                      : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="导航地址">
                {getFieldDecorator('openAddr', {
                  initialValue: this.state.openAddr,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="是否启用">
                {getFieldDecorator('enabled', {
                  initialValue: this.state.enabled,
                  rules: [{ required: true, message: '请选择是否启用' }],
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} disabled={false} allowClear>
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
              <Form.Item label="默认图标">
                {getFieldDecorator('normalIcon', {
                  initialValue: this.state.normalIcon,
                  rules: [{ required: true, message: '请选择默认图标' }],
                })(
                  <CustomUpload
                    iconKey={`default_${this.props.iconType}_icon_${this.state.id}`}
                    parent={this}
                    imgUrl={this.state.normalIconUrl}
                    selectType="default"
                  ></CustomUpload>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="高亮图标">
                {getFieldDecorator('highlightIcon', {
                  initialValue: this.state.highlightIcon,
                  rules: [{ required: true, message: '请选择高亮图标' }],
                })(
                  <CustomUpload
                    iconKey={`light_${this.props.iconType}_icon_${this.state.id}`}
                    parent2={this}
                    imgUrl={this.state.highlightIconUrl}
                    selectType="light"
                  ></CustomUpload>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xl={20} lg={20} md={20} sm={20} xs={20}>
              <Form.Item label="导航参数">
                {getFieldDecorator('openParam', {
                  initialValue: this.state.openParam,
                })(<TextArea placeholder="参数" allowClear autoSize={{ minRows: 3, maxRows: 6 }} />)}
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
        </Form>
      </Modal>
    );
  }
}

const EditForm = Form.create({ name: 'EditModelTree' })(ShowModel);

export default EditForm;
