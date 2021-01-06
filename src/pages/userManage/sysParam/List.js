import React, {Component} from 'react';
import CustomTable from 'components/table/CustomTable';
import {Card, message, Row, Col, Modal, Form, Input, Button} from 'antd';
import {thirdLayout} from 'util/Layout';
import AddEditModel from './Model';
import {menuOperate} from './operateData';
const FormItem = Form.Item;
const {confirm} = Modal;
class SysTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id: 0,
      type: '新增参数',
      iconType: 'add',
      tableData: [],
      param: {
        pname: ''
      },
      pageinfo: {
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      sortFieldName: '',
      sortType: 'desc'
    };
  }
  handleFormData = (data) => {
    const {id, type} = this.state;
    if (type == '编辑参数') {
      // 编辑
      const obj = Object.assign({}, data, {id});
      console.log(obj);
      this.addEditMenu(obj, '编辑成功');
    } else {
      // 新增
      const obj = Object.assign({}, data);
      console.log(obj);
      this.addEditMenu(obj, '新增成功');
    }
  };
  handleAdd = () => {
    this.setState({type: '新增参数', id: 0}, () => {
      this.childEle.openModel();
    });
  };
  componentDidMount() {
    const {param, pageinfo, sortFieldName, sortType} = this.state;
    this.getAppNavList(param, pageinfo, sortFieldName, sortType);
  }
  handleEdit = (row) => {
    // e.stopPropagation();
    console.log(row);
    this.setState({type: '编辑参数', id: row.id}, () => {
      this.childEle.openModel(row);
    });
  };
  // app导航列表
  getAppNavList = (param, pageinfo, sortFieldName, sortType) => {
    const obj = Object.assign({}, {param}, {...pageinfo, sortFieldName, sortType});
    React.$ajax.postData('/api/sys-param-conf/page', obj).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        const resData = res.data ? res.data : [];
        const {pageinfo} = this.state;
        pageinfo.current = resData.currPage;
        pageinfo.pageSize = resData.pageSize;
        pageinfo.total = resData.totalCount;
        this.setState({tableData: resData.list ? resData.list : [], pageinfo});
      }
    });
  };
  // 删除参数
  delteMenu = (id) => {
    React.$ajax.getData('/api/sys-param-conf/deleteById', {id}).then((res) => {
      if (res && res.code == 0) {
        const {param, pageinfo, sortFieldName, sortType} = this.state;
        this.getAppNavList(param, pageinfo, sortFieldName, sortType);
      }
    });
  };
  // 新增/编辑
  addEditMenu = (per, txt) => {
    React.$ajax.postData('/api/sys-param-conf/create', per).then((res) => {
      if (res && res.code == 0) {
        message.info(txt, 0.5, () => {
          this.childEle.handleCancel();
          const {param, pageinfo, sortFieldName, sortType} = this.state;
          this.getAppNavList(param, pageinfo, sortFieldName, sortType);
        });
      }
    });
  };
  clearSysCache = () => {
    React.$ajax.getData('/api/sys-common/clearAllCache').then((res) => {
      if (res && res.code == 0) {
        message.info('清除缓存成功');
      }
    });
  };
  handleDelteMenu = (row) => {
    confirm({
      title: '提示',
      content: '确认删除当前参数吗？',
      onOk: () => {
        this.delteMenu(row.id);
      },
      onCancel() {}
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let {pname} = values;
      pname = pname || '';
      const per = Object.assign({}, this.state.param, {pname});
      const pageinfo = Object.assign({}, this.state.pageinfo, {currPage: 1, current: 1});
      this.setState({param: per, pageinfo}, () => {
        const {param, pageinfo, sortFieldName, sortType} = this.state;
        this.getAppNavList(param, pageinfo, sortFieldName, sortType);
      });
    });
  };
  handleChangeSize = (page) => {
    const pageinfo = Object.assign({}, this.state.pageinfo, {currPage: page, current: page});
    this.setState({pageinfo}, () => {
      const {param, pageinfo, sortFieldName, sortType} = this.state;
      this.getAppNavList(param, pageinfo, sortFieldName, sortType);
    });
  };
  handleShowSizeChange = (cur, size) => {
    const pageinfo = Object.assign({}, this.state.pageinfo, {currPage: cur, current: cur, pageSize: size});
    this.setState({pageinfo}, () => {
      const {param, pageinfo, sortFieldName, sortType} = this.state;
      this.getAppNavList(param, pageinfo, sortFieldName, sortType);
    });
  };
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Card title="查询条件" bordered={false}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col xl={6} lg={6} md={10} sm={24} xs={24}>
                <FormItem label="参数名">{getFieldDecorator('pname')(<Input placeholder="请选择" />)}</FormItem>
              </Col>
              {/* <Col xl={6} lg={6} md={10} sm={24} xs={24}>
                <FormItem label="别名">{getFieldDecorator('code')(<Input placeholder="别名" />)}</FormItem>
              </Col> */}
              <Col xl={6} lg={6} md={10} sm={24} xs={24} style={{textAlign: 'left'}}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Button type="primary" style={{margin: '10px 0'}} onClick={this.handleAdd.bind(this)}>
          新增
        </Button>
        <Button type="primary" style={{margin: '10px 10px'}} onClick={this.clearSysCache.bind(this)}>
          清除系统缓存
        </Button>
        <Card title="" bordered={false}>
          <AddEditModel
            onRef={(ref) => (this.childEle = ref)}
            type={this.state.type}
            iconType={this.state.iconType}
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
            isBordered
            isRowSelects={false}
            isAllRows={false}
            handleChangeSize={this.handleChangeSize}
            handleShowSizeChange={this.handleShowSizeChange}></CustomTable>
        </Card>
      </div>
    );
  }
}

const SysTreeModel = Form.create()(SysTree);

export default SysTreeModel;
