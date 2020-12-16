import React, { Component } from 'react';
import CustomTable from 'components/table/CustomTable';
import { Card, message, Row, Col, Modal, Form, Input, Button } from 'antd';
import { thirdLayout } from 'util/Layout';
const FormItem = Form.Item;
import AddEditModel from './Model';
import { menuOperate } from './operateData';
const { confirm } = Modal;
class SysTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id: 0,
      pid: 0,
      type: '新增树',
      tableData: [],
      code: '',
      name: '',
    };
  }
  handleFormData = (data) => {
    let { id, pid, type } = this.state;
    if (type == '编辑树') {
      // 编辑
      let obj = Object.assign({}, data, { id, pid });
      console.log(obj);
      this.addEditMenu(obj, '编辑成功');
    } else {
      // 新增
      let obj = Object.assign({}, data, { pid: id });
      console.log(obj);
      this.addEditMenu(obj, '新增成功');
    }
  };
  handleAdd = (row) => {
    if (row == 'root') {
      // 根节点新增
      this.setState({ type: '新增树', id: 0 }, () => {
        this.childEle.openModel(row);
      });
    } else {
      // 子节点新增
      this.setState({ type: '新增树', id: row.id }, () => {
        this.childEle.openModel(row.id);
      });
    }
  };
  componentDidMount() {
    let { name, code } = this.state;
    this.getSysTree({ name, code });
  }
  handleEdit = (row) => {
    // e.stopPropagation();
    console.log(row);
    let { icon, level, moduleIndex } = row;
    console.log();
    this.setState({ type: '编辑树', id: row.id, pid: row.pid, icon, level, moduleIndex }, () => {
      this.childEle.openModel(row);
    });
  };
  // 查询所有树
  getSysTree = (per) => {
    React.$ajax.postData('/api/sys/sys-tree/queryAll', per).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        let resData = res.data ? res.data : [];
        this.setState({ tableData: resData });
      }
    });
  };
  // 删除树
  delteMenu = (id) => {
    React.$ajax.getData('/api/sys/sys-tree/delCascade', { id }).then((res) => {
      if (res && res.code == 0) {
        let { name, code } = this.state;
        this.getSysTree({ name, code });
      }
    });
  };
  // 新增/编辑
  addEditMenu = (per, txt) => {
    React.$ajax.postData('/api/sys/sys-tree/create', per).then((res) => {
      if (res && res.code == 0) {
        message.info(txt, 0.5, () => {
          this.childEle.handleCancel();
          let { name, code } = this.state;
          this.getSysTree({ name, code });
        });
      }
    });
  };
  handleDelteMenu = (row) => {
    console.log(row);
    confirm({
      title: '提示',
      content: '确认删除当前树结构吗？',
      onOk: () => {
        this.delteMenu(row.id);
      },
      onCancel() {},
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let { name, code } = values;
      name = name ? name : '';
      code = code ? code : '';
      this.setState({ name, code }, () => {
        let { name, code } = this.state;
        this.getSysTree({ name, code });
      });
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card title="查询条件" bordered={false}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col xl={6} lg={6} md={10} sm={24} xs={24}>
                <FormItem label="名称">{getFieldDecorator('name')(<Input placeholder="角色名称" />)}</FormItem>
              </Col>
              <Col xl={6} lg={6} md={10} sm={24} xs={24}>
                <FormItem label="别名">{getFieldDecorator('code')(<Input placeholder="别名" />)}</FormItem>
              </Col>
              <Col xl={6} lg={6} md={10} sm={24} xs={24} style={{ textAlign: 'left' }}>
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
        <Button type="primary" style={{ margin: '10px 0' }} onClick={this.handleAdd.bind(this, 'root')}>
          新增
        </Button>
        <Card title="" bordered={false}>
          <AddEditModel
            onRef={(ref) => (this.childEle = ref)}
            type={this.state.type}
            handleFormData={this.handleFormData}
          />
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.id;
            }}
            dataSource={this.state.tableData}
            loading={this.state.loading}
            columns={menuOperate(this.handleAdd, this.handleEdit, this.handleDelteMenu)}
            isBordered={true}
            isRowSelects={false}
            isAllRows={false}
          ></CustomTable>
        </Card>
      </div>
    );
  }
}

const SysTreeModel = Form.create()(SysTree);

export default SysTreeModel;
