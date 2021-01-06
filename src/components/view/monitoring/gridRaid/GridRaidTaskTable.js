import React, {Component} from 'react';
import {Table, Button, Tag, Badge, Icon, Divider} from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
import Immutable from 'immutable';
const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    render: (id) => {
      return (
        <Badge
          count={id}
          style={{minWidth: '50px', fontSize: '12px', height: '16px', lineHeight: '16px', backgroundColor: '#99a9bf'}}
        />
      );
    }
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    key: 'taskName'
  },
  {
    title: '执行日期',
    dataIndex: 'taskDate',
    key: 'taskDate',
    render: (text) => {
      return text ? moment(text).format('YYYY-MM-DD') : '--';
    }
  },
  {
    title: '发布日期',
    dataIndex: 'publishDate',
    key: 'publishDate',
    render: (text) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
    }
  },
  ,
  {
    title: '发布人员',
    dataIndex: 'operator',
    key: 'operator',
    render: (text) => {
      return text || '--';
    }
  },
  {
    title: '查看',
    dataIndex: 'key',
    key: 'key',
    render: (id, record, index) => {
      return (
        <span>
          <Link
            to={{
              pathname: '/app/monitoring/ViewGridRaidTask/' + record.id
            }}>
            巡逻轨迹
          </Link>
          <Divider type="vertical" />
          <Link
            to={{
              pathname: '/app/monitoring/ViewGridRaidRealTime/' + record.id
            }}>
            实时轨迹
          </Link>
        </span>
      );
    }
  }
];

class GridRaidTaskTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      filter: null,
      firstLoad: true,
      pageSize: 5,
      currPage: 1,
      data: [],
      loading: false
    };
  }

  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    const isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      const filter = nextProps.filter;
      const _this = this;
      this.setState({firstLoad: true});
      this.setState({filter}, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter
        });
      });
    }
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
      ...filter
    });
  };

  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});
    httpAjax('post', config.apiUrl + '/api/cmdMonitor/listGridTask', {...params})
      .then((res) => {
        const pagination = {...this.state.pagination};
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({data: res.list, loading: false, pagination});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    //   const { match } = this.props;
    return (
      <div>
        <div className="table-operations">
          <Button type="primary">
            <Link to="/app/monitoring/addGrid">
              <Icon type="plus-circle-o" />
              新建网格搜捕任务
            </Link>
          </Button>
        </div>
        <Table
          rowKey={(row) => {
            return 'key-' + row.id;
          }}
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          bordered
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
export default GridRaidTaskTable;
