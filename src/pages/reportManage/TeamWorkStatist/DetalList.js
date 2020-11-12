import React, { Component } from 'react';
import { Card } from 'antd';
import Search from 'pages/reportManage/Common/Search';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
import { teamTableHeaderDetal } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
import { changeNavName } from 'store/actions/common';
require('style/fourReport/reportList.less');

@connect(
  (state) => ({ navData: state.commonReducer.navData }),
  (dispatch) => ({ changeNavData: (nav) => dispatch(changeNavName(nav)) })
)
class TeamWorkStatist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: teamTableHeaderDetal,
      loading: false,
      param: {
        date: '',
        dateType: '',
        groupId: [],
        userId: [],
      },
      sortFieldName: '',
      sortType: 'desc',
      pagination: {
        showSizeChanger: false,
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }
  handleReset = () => {
    this.handleCommon(null, () => false);
  };
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '个人工作统计', '详情'] });
    if (JSON.stringify(util.urlParse(this.props.location.search)) == '{}') {
      let { param, sortFieldName, sortType, pagination } = this.state;
      this.getListData(param, sortFieldName, sortType, pagination);
    }
  }
  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page, pageSize: 10 });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };

  handleSearchData = (data) => {
    this.handleCommon(data, () => false);
  };
  handeExport = (data) => {
    this.handleCommon(data, this.exportExcel);
  };
  exportExcel = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    React.$ajax.fourManage.exportStatisticGroupDetail(newObj).then((res) => {
      let name = `中队统计明细列表.xlsx`;
      util.createFileDown(res, name);
    });
    return true;
  };
  handleCommon = (data, methods) => {
    let { pagination, param } = this.state;
    let _param, _pagination;
    if (data && data.year && !data.month) {
      _param = Object.assign({}, param, {
        date: moment(data.year).format('YYYY'),
        dateType: 'year',
        groupId: data && data.groupId ? [Number(data.groupId)] : [],
      });
    } else if (data && data.year && data.month) {
      _param = Object.assign({}, param, {
        date: moment(data.year).format('YYYY') + '-' + moment(data.month).format('M'),
        dateType: 'month',
        groupId: data && data.groupId ? [Number(data.groupId)] : [],
      });
    } else {
      _param = Object.assign({}, param, {
        date: '',
        dateType: '',
        groupId: data && data.groupId ? [Number(data.groupId)] : [],
      });
    }

    _pagination = Object.assign({}, pagination, { current: 1, currPage: 1, pageSize: 10 });

    this.setState(
      {
        param: _param,
        pagination: _pagination,
      },
      () => {
        let { sortFieldName, sortType, pagination, param } = this.state;
        methods(param, sortFieldName, sortType, pagination) ||
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
  handleRowClick = (recode) => {};
  getListData = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    this.setState({ loading: true });
    React.$ajax.fourManage.pageStatisticGroupDetail(newObj).then((res) => {
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
          <Search
            isShowTeam={true}
            handleSearchData={this.handleSearchData}
            handleReset={this.handleReset}
            handeExport={this.handeExport}
          />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return `key-${row.groupId}-${row.id}-${row.repTime}`;
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

export default withRouter(TeamWorkStatist);
