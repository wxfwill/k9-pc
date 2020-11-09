import React, { Component } from 'react';
import { Card } from 'antd';
import Search from 'pages/reportManage/Common/Search';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');

class TeamWorkStatist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: [],
      loading: false,
      date: '',
      dateType: '',
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
    // console.log('txt');
    // console.log(record);
    this.props.history.push({ pathname: '/app/reportManage/OwnWorkStatise', search: `?groupId=${record.groupId}` });
  };
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '中队工作统计'] });
    this.getListData();
  }
  handleReset = () => {
    this.handleSearchData();
  };
  handleSearchData = (data) => {
    if (data && data.year && !data.month) {
      this.setState({ date: moment(data.year).format('YYYY'), dateType: 'year' }, () => {
        this.getListData();
      });
    } else if (data && data.year && data.month) {
      this.setState(
        {
          date: moment(data.year).format('YYYY') + '-' + moment(data.month).format('M'),
          dateType: 'month',
        },
        () => {
          this.getListData();
        }
      );
    } else {
      this.setState(
        {
          date: '',
          dateType: '',
        },
        () => {
          this.getListData();
        }
      );
    }
  };
  getMontDateRange = (year, month) => {
    let startDate = moment([year, month - 1]);
    let endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
  };
  getListData = () => {
    let { date, dateType } = this.state;
    this.setState({ loading: true });
    React.httpAjax('post', config.apiUrl + '/api/report/statistic4wGroup', { date, dateType }).then((res) => {
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
          <Search handleSearchData={this.handleSearchData} handleReset={this.handleReset} />
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
