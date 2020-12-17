import React, { Component } from 'react';
import { Card } from 'antd';
import Search from 'pages/reportManage/Common/Search';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
import { ownTableHeaderDetal } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
import { changeNavName } from 'store/actions/common';
require('style/fourReport/reportList.less');
import ExportFileHoc from 'components/exportFile/exportFileHoc';

@connect(
  (state) => ({ navData: state.commonReducer.navData }),
  (dispatch) => ({ changeNavData: (nav) => dispatch(changeNavName(nav)) })
)
class TeamWorkStatist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: ownTableHeaderDetal,
      loading: false,
      param: {
        date: '',
        dateType: '',
        groupId: [],
        userId: [],
        categoryId: util.urlParse(this.props.location.search) ? util.urlParse(this.props.location.search).id : null,
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
  handleReset = () => {
    this.handleCommon(null, () => false);
  };
  componentDidMount() {
    // React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '个人工作统计', '详情'] });
    if (JSON.stringify(util.urlParse(this.props.location.search)) == '{}') {
      let { param, sortFieldName, sortType, pagination } = this.state;
      this.getListData(param, sortFieldName, sortType, pagination);
    }
  }
  handleChangeSize = (page, size) => {
    console.log(size);
    this.tableChange({ currPage: page, current: page, pageSize: size });
  };
  handleShowSizeChange = (cur, size) => {
    console.log(cur);
    console.log(size);
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };
  getMontDateRange = (year, month) => {
    let startDate = moment([year, month - 1]);
    let endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
  };
  handleSearchData = (data) => {
    this.handleCommon(data, () => false);
  };
  handeExport = (data) => {
    this.handleCommon(data, this.exportExcel);
  };
  exportExcel = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    this.props.exportExcel('/api/report/exportStatisticPersonalDetail', newObj);
    return true;
  };
  handleCommon = (data, methods) => {
    let { pagination, param } = this.state;
    let _param, _pagination;
    if (data && data.year && !data.month) {
      _param = Object.assign({}, param, {
        date: moment(data.year).format('YYYY'),
        dateType: 'year',
        groupId: data && data.groupId ? [data.groupId] : [],
        userId: data && data.userId ? [data.userId] : [],
      });
    } else if (data && data.year && data.month) {
      _param = Object.assign({}, param, {
        date: moment(data.year).format('YYYY') + '-' + moment(data.month).format('M'),
        dateType: 'month',
        groupId: data && data.groupId ? [data.groupId] : [],
        userId: data && data.userId ? [data.userId] : [],
      });
    } else {
      _param = Object.assign({}, param, {
        date: '',
        dateType: '',
        groupId: data && data.groupId ? [data.groupId] : [],
        userId: data && data.userId ? [data.userId] : [],
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
  handleRowClick = (txt, record, index) => {
    this.props.history.push({
      pathname: '/app/reportManage/OwnWorkStatiseDetal',
      search: `?groupId=${record.groupId}&id=${txt.id}`,
    });
  };
  getListData = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    this.setState({ loading: true });
    React.$ajax.fourManage.pageStatisticPersonalDetail(newObj).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        console.log('resData');
        console.log(resData);

        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        this.setState({
          dataSource: resData.list,
          loading: false,
          pagination,
        });
      }
    });
  };
  render() {
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search
            isShowTeam={true}
            isShowName={true}
            handleSearchData={this.handleSearchData}
            handleReset={this.handleReset}
            handeExport={this.handeExport}
          />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.repTime + row.userId;
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

export default ExportFileHoc()(withRouter(TeamWorkStatist));
