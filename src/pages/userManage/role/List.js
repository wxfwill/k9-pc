import React, { Component } from 'react';
import { Row, Col, Card, Button, message } from 'antd';
import CustomTable from 'components/table/CustomTable';
import { Link, withRouter } from 'react-router-dom';
import { RoleHeaderLabel } from './TableHeader';
import RoleSearch from './RoleSearch';
import AddEditModel from './AddEditModel';
import ResourceModel from './ResourceModel';
import AllotUserModel from './AllotUserModel';
class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null,
      dataSource: [],
      loading: false,
      title: '新增角色',
      id: null,
      param: {
        roleCode: '',
        roleName: '',
        roleType: '',
      },
      pagination: {
        pageSize: 10,
        currPage: 1,
        total: 0,
      },
      ignorePageRequest: false, // 是否忽略分页
      sortFieldName: '',
      sortType: 'desc',
      selectedRowKeys: [],
    };
  }
  handleLimit = (data) => {
    console.log(data);
    data.roleName = data.roleName ? data.roleName : '';
    data.roleCode = data.roleCode ? data.roleCode : '';
    let obj = Object.assign({}, this.state.param, data);
    this.setState({ param: obj }, () => {
      let { param, pagination, sortFieldName, sortType } = this.state;
      this.fetch(param, pagination, sortFieldName, sortType);
    });
  };
  componentDidMount() {
    let { param, pagination, sortFieldName, sortType } = this.state;
    this.fetch(param, pagination, sortFieldName, sortType);
  }
  fetch(param, pagination, sortFieldName, sortType) {
    this.setState({ loading: true });
    let obj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    React.$ajax
      .postData('/api/sys/sys-role/page', obj)
      .then((res) => {
        let resData = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        pagination.pageSize = resData.pageSize;
        let tableArr = resData.list ? resData.list : [];
        this.setState({ dataSource: tableArr, loading: false, pagination });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // 多选
  handleSelectChange = (arrs) => {
    console.log(arrs);
    console.log('多选==');
    this.setState({ selectedRowKeys: arrs });
  };
  // 每页条数
  handleShowSizeChange = (cur, size) => {
    let per = Object.assign({}, this.state.pagination, { currPage: cur, pageSize: size, current: cur });
    this.setState({ pagination: per }, () => {
      this.fetch(this.state.pagination);
    });
  };
  // 页码
  handleChangeSize = (page, size) => {
    //   let per = Object.assign({}, this.state.pagination, { currPage: pages.current, pageSize: pages.pageSize });
    let per = Object.assign({}, this.state.pagination, { currPage: page, current: page });
    this.setState({ pagination: per }, () => {
      this.fetch(this.state.pagination);
    });
  };
  //批量删除
  deleteMore = () => {
    const { selectedRowKeys, pagination } = this.state;
    if (selectedRowKeys.length < 1) {
      message.info('请选择要删除的警员');
    } else {
      React.$ajax.postData('/api/user/deleteUserByIds', { ids: selectedRowKeys }).then((res) => {
        if (res.code == 0) {
          message.success('删除成功');
          this.setState({ selectedRowKeys: [] }, () => {
            this.fetch({
              pageSize: pagination.pageSize,
              currPage: 1,
            });
          });
        } else {
          message.error('删除失败');
        }
      });
    }
  };
  // 新增
  addInfo = () => {
    this.setState({ title: '新增角色' }, () => {
      this.child.openModel();
    });
  };
  // 编辑
  viewEdit = (record) => {
    console.log('编辑角色');
    console.log(record);
    this.setState({ title: '编辑角色', id: record.id }, () => {
      this.child.openModel(record);
    });
    // this.props.history.push({ pathname: '/app/user/infoEditUser', search: `?userId=${record.id}&formStatus=edit` });
  };
  handleFromData = (data) => {
    data.roleType = data.roleType ? data.roleType[1] : null;
    if (this.state.title == '新增角色') {
      let per = Object.assign({}, data, { id: null });
      this.addAndEitdData(per, '新增角色成功');
    } else {
      let per = Object.assign({}, data, { id: this.state.id });
      this.addAndEitdData(per, '编辑角色成功');
    }
  };
  // 新增编辑菜单
  addAndEitdData = (per, txt) => {
    React.$ajax.postData('/api/sys/sys-role/create', per).then((res) => {
      if (res && res.code == 0) {
        message.info(txt, 0.5, () => {
          this.child.handleCancel();
          let { param, pagination, sortFieldName, sortType } = this.state;
          this.fetch(param, pagination, sortFieldName, sortType);
        });
      }
    });
  };
  // 分配菜单
  handleResours = (record) => {
    this.resource.openModel(record);
    // this.props.history.push({ pathname: '/app/user/infoUserData', search: `?userId=${record.id}&formStatus=view` });
  };
  // 分配用户
  handleUser = (record) => {
    this.allotUser.openModel();
    // this.props.history.push({ pathname: '/app/user/infoUserData', search: `?userId=${record.id}&formStatus=view` });
  };
  //删除
  deleteRole = (record, index) => {
    React.$ajax.postData('/api/sys/sys-role/delBatch', { id: [record.id] }).then((res) => {
      if (res.code == 0) {
        message.success('删除成功', 0.5, () => {
          let { param, pagination, sortFieldName, sortType } = this.state;
          this.fetch(param, pagination, sortFieldName, sortType);
        });
      }
    });
  };
  render() {
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="查询条件" bordered={false}>
              <RoleSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <AddEditModel
          onRef={(ref) => (this.child = ref)}
          title={this.state.title}
          handleFromData={this.handleFromData}
        ></AddEditModel>
        <ResourceModel onRef={(ref) => (this.resource = ref)}></ResourceModel>
        <AllotUserModel onRef={(ref) => (this.allotUser = ref)}></AllotUserModel>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <div style={{ marginBottom: '20px' }}>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.addInfo}>
                  新增
                </Button>
                {/* <Button onClick={this.deleteMore}>批量删除</Button> */}
              </div>
              <CustomTable
                setTableKey={(row) => {
                  return row.id;
                }}
                dataSource={this.state.dataSource}
                pagination={this.state.pagination}
                loading={this.state.loading}
                columns={RoleHeaderLabel(this.viewEdit, this.handleResours, this.deleteRole)}
                isBordered={true}
                isRowSelects={false}
                rowSelectKeys={this.state.selectedRowKeys}
                handleChangeSize={this.handleChangeSize}
                handleShowSizeChange={this.handleShowSizeChange}
                handleSelectChange={this.handleSelectChange}
              ></CustomTable>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default withRouter(RoleList);
