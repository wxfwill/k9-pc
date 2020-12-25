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
      type: '新增菜单',
      iconType: 'add',
      tableData: [],
      param: {
        title: '',
      },
      pageinfo: {
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
      sortFieldName: '',
      sortType: 'desc',
    };
  }
  handleFormData = (data) => {
    let { id, type } = this.state;
    if (type == '编辑菜单') {
      // 编辑
      let obj = Object.assign({}, data, { id });
      console.log(obj);
      this.addEditMenu(obj, '编辑成功');
    } else {
      // 新增
      let obj = Object.assign({}, data);
      console.log(obj);
      this.addEditMenu(obj, '新增成功');
    }
  };
  handleAdd = () => {
    this.setState({ type: '新增菜单', id: 0, iconType: 'add' }, () => {
      this.childEle.openModel();
    });
  };
  componentDidMount() {
    let { param, pageinfo, sortFieldName, sortType } = this.state;
    this.getAppNavList(param, pageinfo, sortFieldName, sortType);
  }
  handleEdit = (row) => {
    // e.stopPropagation();
    console.log(row);
    console.log(new Date().getTime());
    this.setState({ type: '编辑菜单', iconType: 'edit', id: row.id, date: new Date().getTime() }, () => {
      this.childEle.openModel(row);
    });
  };
  // app导航列表
  getAppNavList = (param, pageinfo, sortFieldName, sortType) => {
    let obj = Object.assign({}, { param }, { ...pageinfo, sortFieldName, sortType });
    React.$ajax.postData('/api/sys-appNavigation/page', obj).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        let resData = res.data ? res.data : [];
        let { pageinfo } = this.state;
        pageinfo.currPage = resData.currPage;
        pageinfo.pageSize = resData.pageSize;
        pageinfo.total = resData.totalCount;
        this.setState({ tableData: resData.list ? resData.list : [], pageinfo });
      }
    });
  };
  // 删除导航菜单
  delteMenu = (ids) => {
    React.$ajax.getData('/api/sys-appNavigation/deleteBatch', { ids }).then((res) => {
      if (res && res.code == 0) {
        let { param, pageinfo, sortFieldName, sortType } = this.state;
        this.getAppNavList(param, pageinfo, sortFieldName, sortType);
      }
    });
  };
  // 新增/编辑
  addEditMenu = (per, txt) => {
    React.$ajax.postData('/api/sys-appNavigation/create', per).then((res) => {
      if (res && res.code == 0) {
        message.info(txt, 0.5, () => {
          this.childEle.handleCancel();
          let { param, pageinfo, sortFieldName, sortType } = this.state;
          this.getAppNavList(param, pageinfo, sortFieldName, sortType);
        });
      }
    });
  };
  handleDelteMenu = (row) => {
    confirm({
      title: '提示',
      content: '确认删除当前导航菜单吗？',
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
      let { title } = values;
      title = title ? title : '';
      let per = Object.assign({}, this.state.param, { title });
      this.setState({ param: per }, () => {
        let { param, pageinfo, sortFieldName, sortType } = this.state;
        this.getAppNavList(param, pageinfo, sortFieldName, sortType);
      });
    });
  };
  handleChangeSize = () => {};
  handleShowSizeChange = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card title="查询条件" bordered={false}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col xl={6} lg={6} md={10} sm={24} xs={24}>
                <FormItem label="标题">{getFieldDecorator('title')(<Input placeholder="请选择" />)}</FormItem>
              </Col>
              {/* <Col xl={6} lg={6} md={10} sm={24} xs={24}>
                <FormItem label="别名">{getFieldDecorator('code')(<Input placeholder="别名" />)}</FormItem>
              </Col> */}
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
        <Button type="primary" style={{ margin: '10px 0' }} onClick={this.handleAdd.bind(this)}>
          新增
        </Button>
        <Card title="" bordered={false}>
          <AddEditModel
            onRef={(ref) => (this.childEle = ref)}
            type={this.state.type}
            iconType={new Date().getTime()}
            handleFormData={this.handleFormData}
          />
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.id;
            }}
            dataSource={this.state.tableData}
            pagination={this.state.pageinfo}
            loading={this.state.loading}
            columns={menuOperate(this.handleEdit, this.handleDelteMenu)}
            isBordered={true}
            isRowSelects={false}
            isAllRows={false}
            handleChangeSize={this.handleChangeSize}
            handleShowSizeChange={this.handleShowSizeChange}
          ></CustomTable>
        </Card>
      </div>
    );
  }
}
const SysTreeModel = Form.create()(SysTree);

export default SysTreeModel;
