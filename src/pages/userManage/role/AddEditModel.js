import React, { Component } from 'react';
import { Modal, Button, Cascader, Select, Row, Col, Form, Input } from 'antd';
import { editModel } from 'util/Layout';
const { TextArea } = Input;
const Option = Select.Option;
const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      startValue: null,
      endValue: null,
      endOpen: false,
      taksTypeData: [
        {
          id: 1,
          title: '测试',
        },
        {
          id: 2,
          title: 'hah',
        },
      ],
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

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  openModel = () => {
    this.setState({ visible: true });
  };
  handleOk = () => {
    console.log('ok');
    this.props.form.validateFields((err, val) => {
      console.log(val);
      this.props.editFormData && this.props.editFormData(val);
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  };
  selectTaskType = () => {};
  handleSubmit = () => {};
  onChangeTextArea = () => {};
  handleRoleChange = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Modal
        wrapClassName="customModel"
        title="新增角色"
        visible={this.state.visible}
        width={'560px'}
        centered={false}
        destroyOnClose={false}
        maskClosable={false}
        okText={'保存'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleSubmit} {...editModel}>
          <Row type="flex" justify="center">
            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
              <Form.Item label="角色分类">
                {getFieldDecorator('name', {
                  initialValue: undefined,
                })(<Cascader options={options} onChange={this.handleRoleChange} placeholder="请选择" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
              <Form.Item label="名称">
                {getFieldDecorator('satrtTime', {
                  initialValue: startValue,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
              <Form.Item label="编码">
                {getFieldDecorator('satrtTime', {
                  initialValue: startValue,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
              <Form.Item label="描述">
                {getFieldDecorator('mark', {
                  initialValue: undefined,
                })(
                  <TextArea
                    placeholder="请输入"
                    allowClear
                    style={{ width: '100%' }}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    onChange={this.onChangeTextArea}
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

const EditForm = Form.create({ name: 'EditModel' })(ShowModel);

export default EditForm;
