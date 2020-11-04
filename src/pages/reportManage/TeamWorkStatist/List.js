import React, { Component } from 'react';
import { Card } from 'antd';
import Search from './Search';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { tableHeaderLabel } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');

class TeamWorkStatist extends Component {
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
        userName: '',
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
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '中队工作统计'] });
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
  }
  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };
  handleSearchData = (data) => {
    console.log('data=========');
    console.log(data);
    console.log(moment(data.year).format('YYYY'));
    console.log(moment(data.month).format('MM'));
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
  handleClick = () => {
    let { history } = this.props;
    history.push('/app/reportManage/TeamWorkStatist/Detal');
  };
  render() {
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search handleSearchData={this.handleSearchData} />
        </Card>
        <button onClick={this.handleClick.bind(this)}>团队详情</button>
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

export default withRouter(TeamWorkStatist);
