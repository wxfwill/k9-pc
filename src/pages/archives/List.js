import React, {Component} from 'react';
import {Row, Col, Card, Button, message} from 'antd';
import CustomTable from 'components/table/CustomTable';
import {Link, withRouter} from 'react-router-dom';
import {archivesHeaderLabel} from 'localData/userManage/userListTableH';
import UserSearch from './Search';
class ArchivesList extends Component {
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
        title: null
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
    console.log(data);
    const per = data || {};
    per.duty = per.duty ? Number(per.duty) : null;
    per.groupIds = per.groupIds ? [Number(per.groupIds)] : [];
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
  fetch(sortFieldName, sortType, pagination, param) {
    const obj = {sortFieldName, sortType, ...pagination, param};
    this.setState({loading: true});
    React.$ajax.postData('/api/work-wx-sp/pageInfo', obj).then((res) => {
      const pagination = {...this.state.pagination};
      pagination.total = res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      this.setState({dataSource: res.list ? res.list : [], loading: false, pagination});
    });
  }
  // 多选
  handleSelectChange = (arrs) => {
    this.setState({selectedRowKeys: arrs});
  };
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
  // 查看档案
  viewDetail = (record) => {
    this.props.history.push({pathname: '/archivew', search: `?userId=${record.id}&formStatus=view`});
  };
  //删除警员
  deleteUser = (record, index) => {
    const dataSource = this.state.dataSource;
    const {pagination} = this.state;
    React.$ajax.postData('/api/user/deleteUserByIds', {ids: [record.id]}).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        // dataSource.splice(index, 1);
        // this.setState({ dataSource });
        this.fetch({
          pageSize: pagination.pageSize,
          currPage: 1
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
              <div style={{marginBottom: '20px'}}></div>
              <CustomTable
                setTableKey={(row) => {
                  return row.id;
                }}
                dataSource={this.state.dataSource}
                pagination={this.state.pagination}
                loading={this.state.loading}
                columns={archivesHeaderLabel(this.viewDetail)}
                isBordered
                isRowSelects={false}
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
export default withRouter(ArchivesList);
