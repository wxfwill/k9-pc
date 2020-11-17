import React, { Component } from 'react';
import { Modal, Button, Card, Select, Row, Col, Form, Input } from 'antd';
import CustomTable from 'components/table/CustomTable';
import { thirdLayout } from 'util/Layout';
const FormItem = Form.Item;
class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataSource1: [],
      loading1: false,
      columns1: [
        {
          id: 1,
          title: '姓名',
          dataIndex: 'user',
        },
        {
          id: 2,
          title: '账号',
          dataIndex: 'account',
        },
        {
          id: 3,
          title: '手机号',
          dataIndex: 'roleNmae',
        },
      ],
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  openInnerModel = () => {
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
  handleSearch = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        wrapClassName="customModel"
        title="用户查询"
        visible={this.state.visible}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        width={'50%'}
        mask={false}
        // getContainer={false}
        centered={false}
        destroyOnClose={false}
        maskClosable={false}
      >
        <Card title="查询条件" bordered={false}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <FormItem label="姓名" {...thirdLayout}>
                  {getFieldDecorator('policeName')(<Input placeholder="姓名" />)}
                </FormItem>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <FormItem label="账号" {...thirdLayout}>
                  {getFieldDecorator('policeNumber')(<Input placeholder="账号" />)}
                </FormItem>
              </Col>
              <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.groupId;
            }}
            dataSource={this.state.dataSource1}
            loading={this.state.loading1}
            columns={this.state.columns1}
            isBordered={true}
            isRowSelects={false}
          ></CustomTable>
        </Card>
      </Modal>
    );
  }
}

const QuerUserForm = Form.create({ name: 'EditModel' })(ShowModel);

export default QuerUserForm;
