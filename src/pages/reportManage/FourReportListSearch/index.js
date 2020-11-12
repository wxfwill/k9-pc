import React, { Component } from 'react';
import { Card } from 'antd';
import Search from './Search';
import { tableHeaderLabel } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');
import moment from 'moment';

class FourReportListSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: tableHeaderLabel,
      loading: false,
      param: {
        arrest: null,
        categoryIds: [],
        groupId: [],
        isFeedback: null,
        repDateEnd: null,
        repDateStart: null,
        taskLocation: null,
        userId: [],
      },
      sortFieldName: '',
      sortType: 'desc',
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '4w信息查询'] });
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
  }
  exportExcel = (data) => {
    this.handleSearchData(data, this.handleExport);
  };

  handleExport = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    React.httpAjax(
      'post',
      config.apiUrl + '/api/report/export4wReportInfo',
      { ...newObj },
      { responseType: 'blob' }
    ).then((res) => {
      let name = `4w报备统计列表.xlsx`;
      util.createFileDown(res, name);
    });
    return true;
  };

  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };
  handleSearchData = (data, methods) => {
    let { pagination } = this.state;
    let per = data || {};
    let _pagination;

    per.categoryIds = per.categoryIds ? [Number(per.categoryIds)] : [];
    per.groupId = per.groupId ? [Number(per.groupId)] : [];
    per.userId = per.userId ? [Number(per.userId)] : [];
    per.repDateEnd = per.repDateEnd ? moment(per.repDateEnd).format('YYYY-MM-DD') : null;
    per.repDateStart = per.repDateStart ? moment(per.repDateStart).format('YYYY-MM-DD') : null;
    per.taskLocation = per.taskLocation ? per.taskLocation : null;

    let newObj = Object.assign({}, this.state.param, per);
    _pagination = Object.assign({}, pagination, { current: 1, currPage: 1, pageSize: 10 });
    this.setState({ param: newObj, pagination: _pagination }, () => {
      let { param, sortFieldName, sortType, pagination } = this.state;
      methods(param, sortFieldName, sortType, pagination) ||
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
    React.httpAjax('post', config.apiUrl + '/api/report/page4wReportInfo', { ...newObj }).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        this.setState({ dataSource: resData.list, loading: false, pagination });
      }
    });
  };
  render() {
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search handleSearchData={this.handleSearchData} exportExcel={this.exportExcel} />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.userId + row.repTime;
            }}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            loading={this.state.loading}
            columns={this.state.columns}
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

export default FourReportListSearch;
