import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Card} from 'antd';
import Search from './Search';
import {PerHeaderLabel} from 'localData/performance/AssessmentSetting';
import CustomTable from 'components/table/CustomTable';
import moment from 'moment';
import NoData from 'components/NoData';
require('style/fourReport/reportList.less');

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
        userId: []
      },
      sortFieldName: '',
      sortType: 'desc',
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    React.store.dispatch({type: 'NAV_DATA', nav: ['绩效考核', '信息列表查询']});
    const {param, sortFieldName, sortType, pagination} = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
  }
  exportExcel = (data) => {
    this.handleSearchData(data, this.handleExport);
  };

  handleExport = (param, sortFieldName, sortType, pagination) => {
    const newObj = Object.assign({}, {param, sortFieldName, sortType}, pagination);
    React.$ajax.fileDataPost('/api/performanceAssessment/exportSelfEvaluationInfo', newObj).then((res) => {
      const name = `绩效考核列表.xlsx`;
      util.createFileDown(res, name);
    });
    return true;
  };

  handleChangeSize = (page) => {
    this.tableChange({currPage: page, current: page});
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({currPage: cur, pageSize: size, current: cur});
  };
  handleSearchData = (data, methods) => {
    const {pagination} = this.state;
    const per = data || {};
    let _pagination;
    per.approvalState = per.approvalState ? per.approvalState : null;
    per.groupId = per.groupId ? [per.groupId] : [];
    per.userId = per.userId ? [per.userId] : [];
    per.submitState = per.submitState ? per.submitState : null;

    if (per.month) {
      const year = moment(per.month).format('YYYY');
      const m = moment(per.month).format('M');
      const dateObj = util.getMontDateRange(year, m);
      per.repDateEnd = dateObj.end;
      per.repDateStart = dateObj.start;
    } else {
      per.repDateEnd = null;
      per.repDateStart = null;
    }

    const newObj = Object.assign({}, this.state.param, per);
    _pagination = Object.assign({}, pagination, {current: 1, currPage: 1, pageSize: 10});
    this.setState({param: newObj, pagination: _pagination}, () => {
      const {param, sortFieldName, sortType, pagination} = this.state;
      methods(param, sortFieldName, sortType, pagination) ||
        this.getListData(param, sortFieldName, sortType, pagination);
    });
  };
  tableChange = (obj) => {
    if (!util.isObject(obj)) {
      throw new Error(`${obj} must is an object`);
    }
    const per = Object.assign({}, this.state.pagination, obj);
    this.setState({pagination: per}, () => {
      const {param, sortFieldName, sortType, pagination} = this.state;
      this.getListData(param, sortFieldName, sortType, pagination);
    });
  };
  getListData = (param, sortFieldName, sortType, pagination) => {
    const newObj = Object.assign({}, {param, sortFieldName, sortType}, pagination);
    this.setState({loading: true});
    React.$ajax.postData('/api/performanceAssessment/getPageSelfEvaluation', newObj).then((res) => {
      if (res && res.code === 0) {
        const resData = res.data;
        const pagination = {...this.state.pagination};
        pagination.total = resData.totalCount;
        // pagination.current = resData.currPage;
        this.setState({dataSource: resData.list, loading: false, pagination});
      }
    });
  };
  // 详情
  handleDetal = (row) => {
    console.log(row);
    console.log('999');
    this.props.history.push({
      pathname: '/app/performance/assessmentList/detal',
      search: `?detalId=${row.id}&type=detal`
    });
  };
  // 审批
  handleApproval = (row) => {
    this.props.history.push({
      pathname: '/app/performance/assessmentList/detal',
      search: `?detalId=${row.id}&type=approval`
    });
  };
  render() {
    const {dataSource} = this.state;
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search handleSearchData={this.handleSearchData} exportExcel={this.exportExcel} />
        </Card>
        <Card bordered={false}>
          {dataSource && dataSource.length > 0 ? (
            <CustomTable
              setTableKey={(row) => {
                return 'key-' + row.id + row.reportingDate;
              }}
              dataSource={this.state.dataSource}
              pagination={this.state.pagination}
              loading={this.state.loading}
              columns={PerHeaderLabel(this.handleDetal, this.handleApproval)}
              isBordered
              isRowSelects={false}
              isScroll={{x: 1366}}
              handleChangeSize={this.handleChangeSize}
              handleShowSizeChange={this.handleShowSizeChange}></CustomTable>
          ) : (
            <NoData TableHeder={PerHeaderLabel(this.handleDetal, this.handleApproval)} isScroll={{x: 1366}} />
          )}
        </Card>
      </div>
    );
  }
}

export default withRouter(AssessmentList);
