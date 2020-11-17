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
      pagination: {
        houseId: '',
        name: '',
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
      pageSize: 10,
      currPage: 1,
      selectedRowKeys: [],
    };
  }
  handleLimit = (limit) => {
    this.setState({ limit });
  };
  componentDidMount() {
    // this.fetch();
    React.store.dispatch({ type: 'NAV_DATA', nav: ['用户管理', '角色列表'] });
  }
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    this.setState({ loading: true });
    React.$ajax
      .postData('/api/user/list', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({ dataSource: res.list, loading: false, pagination });
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
    this.child.openModel();
  };
  // 编辑
  viewEdit = (record) => {
    this.props.history.push({ pathname: '/app/user/infoEditUser', search: `?userId=${record.id}&formStatus=edit` });
  };
  // 分配菜单
  handleResours = (record) => {
    this.resource.openModel();
    // this.props.history.push({ pathname: '/app/user/infoUserData', search: `?userId=${record.id}&formStatus=view` });
  };
  // 分配用户
  handleUser = (record) => {
    this.allotUser.openModel();
    // this.props.history.push({ pathname: '/app/user/infoUserData', search: `?userId=${record.id}&formStatus=view` });
  };
  //删除
  deleteRole = (record, index) => {
    let dataSource = this.state.dataSource;
    let { pagination } = this.state;
    React.$ajax.postData('/api/user/deleteUserByIds', { ids: [record.id] }).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        // dataSource.splice(index, 1);
        // this.setState({ dataSource });
        this.fetch({
          pageSize: pagination.pageSize,
          currPage: 1,
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
        <AddEditModel onRef={(ref) => (this.child = ref)}></AddEditModel>
        <ResourceModel onRef={(ref) => (this.resource = ref)}></ResourceModel>
        <AllotUserModel onRef={(ref) => (this.allotUser = ref)}></AllotUserModel>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <div style={{ marginBottom: '20px' }}>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.addInfo}>
                  新增
                </Button>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.handleResours}>
                  资源分配
                </Button>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.handleUser}>
                  分配用户
                </Button>

                <Button onClick={this.deleteMore}>批量删除</Button>
              </div>
              <CustomTable
                setTableKey={(row) => {
                  return row.id;
                }}
                dataSource={this.state.dataSource}
                pagination={this.state.pagination}
                loading={this.state.loading}
                columns={RoleHeaderLabel(this.viewEdit, this.handleResours, this.handleUser, this.deleteRole)}
                isBordered={true}
                isRowSelects={true}
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
