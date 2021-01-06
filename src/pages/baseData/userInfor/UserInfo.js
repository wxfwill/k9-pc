import React, {Component} from 'react';
import {Row, Col, Card, Button} from 'antd';
import CustomTable from 'components/table/CustomTable';
// import UserTable from './UserTable';
import UserSearch from './UserSearch';
class UserInfo extends Component {
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
        total: 0
      },
      pageSize: 10,
      currPage: 1,
      selectedRowKeys: []
    };
  }
  handleLimit = (limit) => {
    this.setState({limit});
  };
  // 多选
  handleSelectChange = (arrs) => {
    this.setState({selectedRowKeys: arrs});
  };
  // 每页条数
  handleShowSizeChange = (cur, size) => {
    const per = Object.assign({}, this.state.pagination, {currPage: cur, pageSize: size, current: cur});
    this.setState({pagination: per}, () => {
      this.fetch(this.state.pagination);
    });
  };
  // 页码
  handleChangeSize = (page, size) => {
    //   let per = Object.assign({}, this.state.pagination, { currPage: pages.current, pageSize: pages.pageSize });
    const per = Object.assign({}, this.state.pagination, {currPage: page, current: page});
    this.setState({pagination: per}, () => {
      this.fetch(this.state.pagination);
    });
  };
  //删除
  deleteDogs = (record, index) => {
    const {pagination} = this.state;
    React.$ajax.postData('/api/dogRoom/deleteByIds', {ids: [record.id]}).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        this.fetch({
          pageSize: pagination.pageSize,
          currPage: 1
        });
      } else {
        message.serror('删除失败');
      }
    });
  };
  //批量删除
  deleteMore = () => {
    const {selectedRowKeys, pagination} = this.state;
    if (selectedRowKeys.length < 1) {
      message.warn('请选择要删除的视频');
    } else {
      React.$ajax.postData('/api/dogRoom/deleteByIds', {ids: selectedRowKeys}).then((res) => {
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
  render() {
    const columns = [];
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
              {/* <UserTable filter={this.state.limit} /> */}
              <div style={{marginBottom: '20px'}}>
                <Button type="primary" style={{marginRight: '20px'}} onClick={this.addInfo}>
                  <Link to={{pathname: '/app/user/infoAddUser', query: {targetText: '新增'}}}>新增人员</Link>
                </Button>
                <Button onClick={this.deleteMore}>批量删除</Button>
              </div>
              <CustomTable
                setTableKey={(row) => {
                  return 'key-' + row.id + '-' + row.name;
                }}
                dataSource={this.state.dataSource}
                pagination={this.state.pagination}
                loading={this.state.loading}
                columns={columns}
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
export default UserInfo;

// WEBPACK FOOTER //
// ./src/components/admin/userInfor/UserInfo.js
