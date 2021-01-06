import React, {Component} from 'react';
import {Row, Col, Card, Button, message} from 'antd';
import CustomTable from 'components/table/CustomTable';
import {Link, withRouter} from 'react-router-dom';
// import UserTable from './UserTable';
import {userHeaderLabel} from 'localData/userManage/userListTableH';
import UserSearch from './UserSearch';
class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      sortFieldName: '',
      sortType: 'desc',
      param: {
        duty: null,
        groupIds: [],
        policeName: null,
        policeNumber: null,
        title: null,
        orderDesc: true
      },
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      selectedRowKeys: []
      // dutyList: [], // 职务信息
    };
  }
  handleLimit = (data) => {
    const per = data || {};
    per.duty = per.duty ? Number(per.duty) : null;
    per.policeName = per.policeName ? per.policeName : null;
    per.policeNumber = per.policeNumber ? per.policeNumber : null;
    per.title = per.title ? Number(per.title) : null;
    const _per = Object.assign({}, this.state.param, per);
    const _pagination = Object.assign({}, this.state.pagination, {current: 1, currPage: 1, pageSize: 10});
    this.setState({param: _per, pagination: _pagination}, () => {
      const {sortFieldName, sortType, pagination, param} = this.state;
      this.fetch(sortFieldName, sortType, pagination, param);
    });
  };
  componentDidMount() {
    const {sortFieldName, sortType, pagination, param} = this.state;
    this.fetch(sortFieldName, sortType, pagination, param);
  }
  // 每页条数
  handleShowSizeChange = (cur, size) => {
    const per = Object.assign({}, this.state.pagination, {currPage: cur, pageSize: size, current: cur});
    this.setState({pagination: per}, () => {
      const {sortFieldName, sortType, pagination, param} = this.state;
      this.fetch(sortFieldName, sortType, pagination, param);
    });
  };
  // 页码
  handleChangeSize = (page, size) => {
    //   let per = Object.assign({}, this.state.pagination, { currPage: pages.current, pageSize: pages.pageSize });
    const per = Object.assign({}, this.state.pagination, {currPage: page, current: page});
    this.setState({pagination: per}, () => {
      const {sortFieldName, sortType, pagination, param} = this.state;
      this.fetch(sortFieldName, sortType, pagination, param);
    });
  };
  fetch(sortFieldName, sortType, pagination, param) {
    const obj = {sortFieldName, sortType, ...pagination, param};
    this.setState({loading: true});
    React.$ajax.postData('/api/user/pageInfo', obj).then((res) => {
      const pagination = {...this.state.pagination};
      pagination.total = res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      this.setState({dataSource: res.list ? res.list : [], loading: false, pagination});
    });
  }
  // 多选
  handleSelectChange = (arrs) => {
    console.log(arrs);
    console.log('多选==');
    this.setState({selectedRowKeys: arrs});
  };
  //批量删除
  deleteMore = () => {
    const {selectedRowKeys, pagination} = this.state;
    if (selectedRowKeys.length < 1) {
      message.info('请选择要删除的警员');
    } else {
      React.$ajax.postData('/api/user/deleteUserByIds', {ids: selectedRowKeys}).then((res) => {
        if (res.code == 0) {
          message.success('删除成功');
          this.setState({selectedRowKeys: []}, () => {
            this.fetch({
              pageSize: pagination.pageSize,
              currPage: 1
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
    this.props.history.push({pathname: '/app/user/info/add', search: `?formStatus=add`});
  };
  // 查看
  viewDetail = (record) => {
    this.props.history.push({pathname: '/app/user/info/view', search: `?userId=${record.id}&formStatus=view`});
  };
  // 编辑
  viewEdit = (record) => {
    this.props.history.push({pathname: '/app/user/info/edit', search: `?userId=${record.id}&formStatus=edit`});
  };
  //删除警员
  deleteUser = (record, index) => {
    React.$ajax.postData('/api/user/deleteUserByIds', {ids: [record.id]}).then((res) => {
      if (res.code == 0) {
        message.success('删除成功', 0.5, () => {
          const {sortFieldName, sortType, pagination, param} = this.state;
          this.fetch(sortFieldName, sortType, pagination, param);
        });
      }
    });
  };
  render() {
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <UserSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <div style={{marginBottom: '20px'}}>
                <Button type="primary" style={{marginRight: '20px'}} onClick={this.addInfo}>
                  新增人员
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
                columns={userHeaderLabel(this.viewDetail, this.viewEdit, this.deleteUser)}
                isBordered
                isRowSelects
                rowSelectKeys={this.state.selectedRowKeys}
                handleChangeSize={this.handleChangeSize}
                handleShowSizeChange={this.handleShowSizeChange}
                handleSelectChange={this.handleSelectChange}></CustomTable>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default withRouter(UserInfo);
