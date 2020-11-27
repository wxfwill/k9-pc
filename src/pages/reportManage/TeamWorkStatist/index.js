import React, { Component } from 'react';
import { Card, message } from 'antd';
import Search from 'pages/reportManage/Common/Search';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');
import ExportFileHoc from 'components/exportFile/exportFileHoc';

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
      lastIndex: null,
      tableHeader: [],
      sortType: 'desc',
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }
  handleRowClick = (txt, record, index) => {
    console.log('txt');
    console.log(txt);
    // console.log(index);
    if (txt.groupId) {
      // 中队
      this.props.history.push({ pathname: '/app/reportManage/OwnWorkStatise', search: `?groupId=${txt.groupId}` });
    } else {
      // 具体事项
      this.props.history.push({
        pathname: '/app/reportManage/TeamWorkStatistDetal',
        search: `?groupId=${record.groupId}&id=${txt.id}`,
      });
    }
  };
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '中队工作统计'] });
    this.getListData();
    console.log('this.props');
    console.log(this.props);
  }
  handleReset = () => {
    this.handleSearchData(null, () => false);
  };
  handleSearchData = (data, methods) => {
    // this.setState({ tableHeader: [] });
    if (data && data.year && !data.month) {
      this.setState({ date: moment(data.year).format('YYYY'), dateType: 'year' }, () => {
        methods() || this.getListData();
      });
    } else if (data && data.year && data.month) {
      this.setState(
        {
          date: moment(data.year).format('YYYY') + '-' + moment(data.month).format('M'),
          dateType: 'month',
        },
        () => {
          methods() || this.getListData();
        }
      );
    } else {
      this.setState(
        {
          date: '',
          dateType: '',
        },
        () => {
          methods() || this.getListData();
        }
      );
    }
  };
  getMontDateRange = (year, month) => {
    let startDate = moment([year, month - 1]);
    let endDate = moment(startDate).endOf('month');
    return { start: startDate, end: endDate };
  };
  handeExport = (data) => {
    this.handleSearchData(data, this.exportExcel);
  };
  getObj = (item, index) => {
    return {
      title: item.columnName,
      dataIndex: item.id,
      width: 100,
      key: item.columnName + item.id + Math.random(),
      align: 'center',
      // fixed: this.state.num - 1 == index ? 'left' : null,
      fixed: 0 == index ? 'left' : null,
      render: (txt, record, index) => {
        return (
          <span
            className={record[item.columnName] != '总计' && this.state.lastIndex != index ? 'tabEleRow' : ''}
            key={'key-' + item.id}
            onClick={this.state.lastIndex != index ? this.handleRowClick.bind(this, txt, record, index) : null}
          >
            {record[item.id] ? record[item.id].value : record[item.columnName]}
          </span>
        );
      },
    };
  };
  recursion = (obj, item, index) => {
    obj = this.getObj(item, index);
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
    this.setState({ num: list.length });
    if (list && list.length > 0) {
      list.forEach((item, index) => {
        obj = this.recursion(obj, item, index);
        newArr.push(obj);
      });
    }
    this.setState({ tableHeader: newArr });
    return newArr;
  };
  getListData = () => {
    let { date, dateType } = this.state;
    this.setState({ loading: true });
    React.$ajax.fourManage.statisticGroup({ date, dateType }).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        let titleArr = resData ? resData.columns : [];
        let formatArr = [];
        let resArr = resData.data && resData.data.length > 0 ? resData.data : [];
        this.setState({ lastIndex: resArr.length - 1 });
        formatArr = this.formatArrList(titleArr);

        this.setState({ columns: formatArr, dataSource: resArr, loading: false });
      }
    });
  };
  exportExcel = () => {
    let { date, dateType } = this.state;
    this.props.exportExcel('/api/report/exportStatisticGroup', { date, dateType });
    return true;
  };
  render() {
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search
            handleSearchData={this.handleSearchData}
            handleReset={this.handleReset}
            handeExport={this.handeExport}
          />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.groupId;
            }}
            dataSource={this.state.dataSource}
            isScroll={{ x: 1366 }}
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

export default ExportFileHoc()(withRouter(TeamWorkStatist));
