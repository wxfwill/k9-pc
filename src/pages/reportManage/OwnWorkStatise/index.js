import React, { Component } from 'react';
import { Card } from 'antd';
import Search from 'pages/reportManage/Common/Search';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
import CustomTable from 'components/table/CustomTable';
import { changeNavName } from 'store/actions/common';
import { createFileDown } from 'libs/util/index.js';
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
      columns: [],
      loading: false,
      param: {
        date: '',
        dateType: '',
        groupId: [],
        userId: [],
      },
      lastIndex: null,
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
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '个人工作统计'] });
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
  getMontDateRange = (year, month) => {
    let startDate = moment([year, month - 1]);
    let endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
  };
  handleSearchData = (data) => {
    this.handleCommon(data, () => false);
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
  handeExport = (data) => {
    this.handleCommon(data, this.exportExcel);
  };
  exportExcel = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    React.$ajax.fourManage.exportStatisticPersonal(newObj).then((res) => {
      let name = `个人统计列表.xlsx`;
      createFileDown(res, name);
    });
    return true;
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
  getObj = (item) => {
    return {
      title: item.columnName,
      dataIndex: item.id,
      key: item.columnName,
      align: 'center',
      render: (txt, record, index) => {
        return (
          // <span
          //   className={record[item.id] ? 'tabEleRow' : ''}
          //   key={'key-' + item.id}
          //   onClick={record[item.id] ? this.handleRowClick.bind(this, txt, record) : null}
          // >
          //   {record[item.id] ? record[item.id].value : record[item.columnName]}
          // </span>
          <span
            className={record[item.columnName] != '总计' && this.state.lastIndex != index ? 'tabEleRow' : ''}
            key={'key-' + item.id}
            onClick={this.state.lastIndex != index ? this.handleRowClick.bind(this, txt, record, index) : null}
          >
            {record[item.id] ? record[item.id].value : record[item.columnName]}
            <i style={{ display: record[item.columnName] == '姓名' ? 'block' : 'none' }}>考核项</i>
          </span>
        );
      },
    };
  };
  recursion = (obj, item) => {
    obj = this.getObj(item);
    if (item.children && item.children.length > 0) {
      obj.children = [];
      item.children.map((n) => {
        obj.children.push(this.getObj(n));
      });
    }
    return obj;
  };
  formatArrList = (list) => {
    let obj = {};
    let newArr = [];
    if (list && list.length > 0) {
      list.forEach((item) => {
        obj = this.recursion(obj, item);
        newArr.push(obj);
      });
    }
    return newArr;
  };
  handleRowClick = (txt, record, index) => {
    this.props.history.push({
      pathname: '/app/reportManage/OwnWorkStatiseDetal',
      search: `?groupId=${record.id}&id=${txt.id}`,
    });
  };
  getListData = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    this.setState({ loading: true });
    React.$ajax.fourManage.pageStatisticPersonal(newObj).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        let titleArr = resData.data ? resData.data.columns : [];
        let formatArr = [];
        let resArr = resData.data && resData.data.data.length > 0 ? resData.data.data : [];

        formatArr = this.formatArrList(titleArr);

        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        pagination.pageSize = 11;
        this.setState({
          dataSource: resArr,
          columns: formatArr,
          loading: false,
          lastIndex: pagination.pageSize - 1,
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
            handleSearchData={this.handleSearchData}
            handleReset={this.handleReset}
            handeExport={this.handeExport}
          />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + (row.id ? row.id : 0);
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
