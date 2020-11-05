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
      columns: [],
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
      endDate: null,
      startDate: null,
      sortFieldName: '',
      sortType: 'desc',
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }
  handleRowClick = (record) => {
    console.log('txt');
    console.log(record);
  };
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '中队工作统计'] });
    this.getListData();
  }
  handleSearchData = (data) => {
    console.log(moment(data.year).format('YYYY'));
    console.log(moment(data.month).format('M'));
    let year = Number(moment(data.year).format('YYYY'));
    let month = Number(moment(data.month).format('M'));
    let monthObj = this.getMontDateRange(year, month);
    console.log(moment(monthObj.start).format('YYYY-MM-DD'));
    console.log(moment(monthObj.end).format('YYYY-MM-DD'));
    this.setState(
      {
        endDate: moment(monthObj.end).format('YYYY-MM-DD'),
        startDate: moment(monthObj.start).format('YYYY-MM-DD'),
      },
      () => {
        this.getListData();
      }
    );
  };
  getMontDateRange = (year, month) => {
    let startDate = moment([year, month - 1]);
    let endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
  };
  getListData = () => {
    let { endDate, startDate } = this.state;
    this.setState({ loading: true });
    React.httpAjax('post', config.apiUrl + '/api/report/statistic4wGroup', { endDate, startDate }).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        let titleArr = resData ? resData.title : [];
        let formatArr = [];
        titleArr.map((item, index) => {
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
          formatArr.push(obj);
        });
        this.setState({ columns: formatArr, dataSource: resData ? resData.data : [], loading: false });
      }
    });
  };
  render() {
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search handleSearchData={this.handleSearchData} />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.groupId;
            }}
            dataSource={this.state.dataSource}
            loading={this.state.loading}
            columns={this.state.columns}
            isBordered={true}
            isRowSelects={false}
          ></CustomTable>
        </Card>
      </div>
    );
  }
}

export default withRouter(TeamWorkStatist);
