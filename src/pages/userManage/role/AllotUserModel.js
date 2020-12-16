import React, { Component } from 'react';
import { Modal, Button, Card, Select, Row, Col, Form, Input } from 'antd';
import CustomTable from 'components/table/CustomTable';
import { thirdLayout } from 'util/Layout';
import QuerUserForm from './QueryAllModel';
const FormItem = Form.Item;
class ShowModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      startValue: null,
      dataSource: [],
      loading: false,
      columns: [
        {
          id: 1,
          title: '用户名',
          dataIndex: 'user',
        },
        {
          id: 2,
          title: '账号',
          dataIndex: 'account',
        },
        {
          id: 3,
          title: '角色名',
          dataIndex: 'roleNmae',
        },
        {
          id: 4,
          title: '创建时间',
          dataIndex: 'time',
        },
        {
          id: 5,
          title: '操作',
          dataIndex: 'option',
          render: (txt, record) => {
            return <Button>删除</Button>;
          },
        },
      ],
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  openModel = () => {
    this.setState({ visible: true });
  };
  handleCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  };
  addUser = () => {
    console.log('=内层弹窗');
    this.innerChild.openInnerModel();
  };
  handleSearch = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        wrapClassName="customModel"
        title="分配用户"
        visible={this.state.visible}
        width={'50%'}
        onCancel={this.handleCancel}
        centered={false}
        destroyOnClose={false}
        maskClosable={false}
        footer={null}
      >
        <Card title="查询条件" bordered={false}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <FormItem label="警名姓名" {...thirdLayout}>
                  {getFieldDecorator('policeName')(<Input placeholder="警名姓名" />)}
                </FormItem>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <FormItem label="警名编号" {...thirdLayout}>
                  {getFieldDecorator('policeNumber')(<Input placeholder="警名编号" />)}
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
        <QuerUserForm onRef={(ref) => (this.innerChild = ref)}></QuerUserForm>
        <Card bordered={false}>
          <div style={{ marginBottom: '20px' }}>
            <Button type="primary" style={{ marginRight: '20px' }} onClick={this.addUser}>
              新增
            </Button>
          </div>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.groupId;
            }}
            dataSource={this.state.dataSource}
            loading={this.state.loading}
            columns={this.state.columns}
            isBordered={true}
            isRowSelects={false}
          ></CustomTable>
        </Card>
      </Modal>
    );
  }
}

const EditForm = Form.create({ name: 'EditModel' })(ShowModel);

export default EditForm;
