import React from 'react';
import {Link} from 'react-router-dom';
import {Table, message, Tag, Badge, Button, Icon} from 'antd';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';
require('style/view/common/deployTable.less');
class PerformanceTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      pageSize: 5,
      currPage: 1,
      dataSource: [],
      loading: false,
      filter: '',
      detailSource: '',
      successColor: '#2db7f5',
      waringColor: 'volcano'
    };
  }
  componentWillMount() {
    this.fetch({pageSize: 5, currPage: 1, yearMonth: ''});
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    const filter = nextProps.filter;
    const _this = this;
    this.setState({filter: filter}, function () {
      _this.fetch({
        pageSize: _this.state.pageSize,
        currPage: 1,
        yearMonth: (filter && filter != '') || filter != null ? filter : ''
      });
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    const {filter} = this.state;
    this.setState({
      pagination: pager
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      yearMonth: filter && filter
    });
  };
  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});
    httpAjax('post', config.apiUrl + '/api/trainCheck/listData', {...params})
      .then((res) => {
        const pagination = {...this.state.pagination};
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({dataSource: res.list, loading: false, pagination});
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  viewDetail = (record) => {
    sessionStorage.setItem('performanceChangeWeek', JSON.stringify(record));
  };
  render() {
    const {showDetail, changeLeft, detailSource, successColor, waringColor} = this.state;
    const columns = [
      {
        title: '排名',
        dataIndex: 'monthlyRank',
        render: (text, record, index) => {
          if (text == 1) {
            return <Tag color="#f50">{text}</Tag>;
          } else if (text == 2) {
            return <Tag color="#87d068">{text}</Tag>;
          } else {
            return <Tag color="#2db7f5">{text}</Tag>;
          }
        }
      },
      {
        title: '月份',
        dataIndex: 'yearMonth'
      },
      {
        title: '姓名',
        dataIndex: 'userName'
      },
      {
        title: '搜毒搜爆科目训练',
        dataIndex: 'searchScore'
      },
      {
        title: '刑侦科目训练',
        dataIndex: 'criminalInvestigationScore'
      },
      {
        title: '训练考核',
        dataIndex: 'trainScore'
      },
      {
        title: '警犬的使用',
        dataIndex: 'dogUseScore'
      },
      {
        title: '理化管理',
        dataIndex: 'dailyScore'
      },
      {
        title: '总分',
        dataIndex: 'totalScore'
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        render: (text, record, index) => {
          return (
            <div>
              <Button type="primary" size="small" style={{marginRight: '10px'}} onClick={() => this.viewDetail(record)}>
                <Link to="/app/assess/performanceDetail">查看详情</Link>
              </Button>
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.dataSource}
          bordered
          pagination={this.state.pagination}
          rowKey="userId"
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
export default PerformanceTable;

// WEBPACK FOOTER //
// ./src/components/admin/tables/performanceAppraisal/PerformanceTable.js
