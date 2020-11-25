import React, { Component } from 'react';
import { Card } from 'antd';
import Search from './Search';
import { dailyInformationDetal } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');
import moment from 'moment';

class DailyInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: dailyInformationDetal,
      loading: false,
      sortFieldName: null,
      sortType: 'desc',
      id: null,
      param: {
        write: null,
        endDate: null,
        startDate: null,
        groupId: null,
        userId: null,
      },
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }
  componentDidMount() {
    // React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '日报信息查询'] });
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
  }
  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };
  exportExcel = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    React.$ajax.fileDataPost('/api/report/exportPageDailyWork', newObj).then((res) => {
      let name = `日报信息列表.xlsx`;
      util.createFileDown(res, name);
    });
    return true;
  };
  handeExport = (data) => {
    this.handleSearchData(data, this.exportExcel);
  };
  handleSearchData = (data, init) => {
    console.log(data);
    let per = data || {};
    let _pagination,
      { pagination } = this.state;
    per.userId = per.userId ? Number(per.userId) : null;
    per.groupId = per.groupId ? Number(per.groupId) : null;
    per.endDate = per.endDate ? moment(per.endDate).format('YYYY-MM-DD') : null;
    per.startDate = per.startDate ? moment(per.startDate).format('YYYY-MM-DD') : null;
    let newObj = Object.assign({}, this.state.param, per);

    _pagination = Object.assign({}, pagination, { current: 1, currPage: 1, pageSize: 10 });
    this.setState(
      {
        param: newObj,
        pagination: _pagination,
      },
      () => {
        let { param, sortFieldName, sortType, pagination } = this.state;
        init(param, sortFieldName, sortType, pagination) ||
          this.getListData(param, sortFieldName, sortType, pagination);
      }
    );
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
    React.$ajax.postData('/api/report/pageDailyWork', { ...newObj }).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        resData.list &&
          resData.list.forEach((value, index) => {
            value.pageNumber = resData.currPage;
          });
        this.setState({ dataSource: resData.list ? resData.list : [], loading: false, pagination });
      }
    });
  };

  render() {
    const { dataSource, pagination, loading, columns } = this.state;
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search handleSearchData={this.handleSearchData} handeExport={this.handeExport} />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.repUser + Math.random();
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

export default DailyInformation;
