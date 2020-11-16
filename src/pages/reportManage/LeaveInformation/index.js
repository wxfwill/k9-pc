import React, { Component } from 'react';
import { Card, Button } from 'antd';
import Search from './Search';
import { leaveInformationDetal } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');
import moment from 'moment';
import EditModel from './EditModel';

class LeaveInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: leaveInformationDetal,
      loading: false,
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '请假信息查询'] });
  }
  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };
  handleSearchData = (data) => {
    let per = data;
    per.categoryIds = per.categoryIds != null ? [per.categoryIds] : [];
    per.groupId = per.groupId != null ? [per.groupId] : [];
    per.repDateEnd = per.repDateEnd && moment(per.repDateEnd).format('YYYY-MM-DD');
    per.repDateStart = per.repDateStart && moment(per.repDateStart).format('YYYY-MM-DD');
    let newObj = Object.assign({}, this.state.param, per);
    this.setState({ param: newObj }, () => {
      let { param, sortFieldName, sortType, pagination } = this.state;
      this.getListData(param, sortFieldName, sortType, pagination);
    });
  };
  tableChange = (obj) => {
    if (!util.isObject(obj)) {
      throw new Error(`${obj} must is an object`);
    }
    let per = Object.assign({}, this.state.pagination, obj);
    this.setState({ pagination: per }, () => {
      let { param, sortFieldName, sortType, pagination } = this.state;
      this.getListData(param, sortFieldName, sortType, pagination);
    });
  };
  getListData = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    this.setState({ loading: true });
    // React.httpAjax('post', config.apiUrl + '/api/report/page4wReportInfo', { ...newObj }).then((res) => {
    //   if (res && res.code === 0) {
    //     let resData = res.data;
    //     const pagination = { ...this.state.pagination };
    //     pagination.total = resData.totalCount;
    //     pagination.current = resData.currPage;
    //     this.setState({ dataSource: resData.list, loading: false, pagination });
    //   }
    // });
  };
  handleEdit = () => {
    this.child.openModel();
  };

  render() {
    const { dataSource, pagination, loading, columns } = this.state;
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search handleSearchData={this.handleSearchData} />
        </Card>
        <Button type="primary" onClick={this.handleEdit}>
          编辑
        </Button>
        <EditModel onRef={(ref) => (this.child = ref)}></EditModel>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.userId + row.repTime;
            }}
            dataSource={dataSource}
            pagination={pagination}
            loading={loading}
            columns={columns}
            isBordered={true}
            isRowSelects={false}
            handleChangeSize={this.handleChangeSize}
            handleShowSizeChange={this.handleShowSizeChange}
          ></CustomTable>
        </Card>
      </div>
    );
  }
}

export default LeaveInformation;
