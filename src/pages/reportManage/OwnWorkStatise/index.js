import React, { Component } from 'react';
import { Card } from 'antd';
import Search from 'pages/reportManage/Common/Search';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
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
      columns: [],
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
    this.handleCommon();
  };
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '个人工作统计'] });
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
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
    this.handleCommon(data);
  };
  handleCommon = (data) => {
    let { pagination, param } = this.state;
    let _param, _pagination;
    if (data && data.year && !data.month) {
      _param = Object.assign({}, param, {
        date: moment(data.year).format('YYYY'),
        dateType: 'year',
        groupId: data && data.groupId ? [data.groupId] : [],
      });
    } else if (data && data.year && data.month) {
      _param = Object.assign({}, param, {
        date: moment(data.year).format('YYYY') + '-' + moment(data.month).format('M'),
        dateType: 'month',
        groupId: data && data.groupId ? [data.groupId] : [],
      });
    } else {
      _param = Object.assign({}, param, {
        date: '',
        dateType: '',
        groupId: data && data.groupId ? [data.groupId] : [],
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
    React.httpAjax('post', config.apiUrl + '/api/report/pageStatistic4wPersonal', { ...newObj }).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        let heardArr = resData.data ? resData.data.title : [];
        let newColumns = [];
        heardArr.map((item, index) => {
          let obj = {
            title: ((item) => {
              let arr = item && item.toString().split('##');
              return arr[0];
            })(item),
            dataIndex: item,
            key: item,
            align: 'center',
            render: (txt, record, index) => {
              return (
                <span className="tabEleRow" onClick={this.handleRowClick.bind(this, record)}>
                  {record[item]}
                </span>
              );
            },
          };
          newColumns.push(obj);
        });
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        pagination.pageSize = 11;
        this.setState({
          dataSource: resData.data ? resData.data.data : [],
          columns: newColumns,
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
          <Search isShowTeam={true} handleSearchData={this.handleSearchData} handleReset={this.handleReset} />
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
