import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'antd';
import Search from './Search';
import { PerHeaderLabel } from 'localData/performance/AssessmentSetting';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');
import moment from 'moment';

class AssessmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      // columns: performanceHeaderLabel,
      loading: false,
      param: {
        arrest: null,
        assessmentId: null,
        groupId: [],
        approvalState: null,
        repDateEnd: null,
        repDateStart: null,
        submitState: null,
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
    React.store.dispatch({ type: 'NAV_DATA', nav: ['绩效考核', '信息列表查询'] });
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
  }
  exportExcel = (data) => {
    this.handleSearchData(data, this.handleExport);
  };

  handleExport = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    React.$ajax.fileDataPost('/api/performanceAssessment/exportSelfEvaluationInfo', newObj).then((res) => {
      let name = `绩效考核列表.xlsx`;
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
    per.approvalState = per.approvalState ? Number(per.approvalState) : null;
    per.groupId = per.groupId ? [Number(per.groupId)] : [];
    per.userId = per.userId ? [Number(per.userId)] : [];
    per.submitState = per.submitState ? per.submitState : null;

    if (per.month) {
      let year = moment(per.month).format('YYYY');
      let m = moment(per.month).format('M');
      let dateObj = util.getMontDateRange(year, m);
      per.repDateEnd = dateObj.end;
      per.repDateStart = dateObj.start;
    } else {
      per.repDateEnd = null;
      per.repDateStart = null;
    }

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
    React.$ajax.postData('/api/performanceAssessment/getPageSelfEvaluation', newObj).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        // pagination.current = resData.currPage;
        this.setState({ dataSource: resData.list, loading: false, pagination });
      }
    });
  };
  // 详情
  handleDetal = (row) => {
    console.log(row);
    console.log('999');
    this.props.history.push({
      pathname: '/app/performance/assessmentList/detal',
      search: `?detalId=${row.id}&type=detal`,
    });
  };
  // 审批
  handleApproval = (row) => {
    this.props.history.push({
      pathname: '/app/performance/assessmentList/detal',
      search: `?detalId=${row.id}&type=approval`,
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
              return 'key-' + row.id + row.reportingDate;
            }}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            loading={this.state.loading}
            columns={PerHeaderLabel(this.handleDetal, this.handleApproval)}
            isBordered={true}
            isRowSelects={false}
            isScroll={{ x: 1366 }}
            handleChangeSize={this.handleChangeSize}
            handleShowSizeChange={this.handleShowSizeChange}
          ></CustomTable>
        </Card>
      </div>
    );
  }
}

export default withRouter(AssessmentList);
