import React, {Component} from 'react';
import {Table, Button, Tag, Badge, Icon, Divider} from 'antd';
import {withRouter, Link} from 'react-router-dom';

import Immutable from 'immutable';
import {connect} from 'react-redux';
import {changeMapType} from 'store/actions/common.js';
import {tableHeader} from './GridRaidTaskTableHeader';
require('style/view/common/deployTable.less');

@connect(
  (state) => ({navData: state.commonReducer.navData}),
  (dispatch) => ({changeGridMap: (bool) => dispatch(changeMapType(bool))})
)
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
  handleViewMap = (row) => {
    this.props.changeGridMap(true);
    // this.props.history.push('/app/monitoring/grid/viewMap');
    window.open('http://localhost:8001/#/app/monitoring/grid/viewMap');
  };
  handleReact = () => {
    this.props.changeGridMap(false);
  };
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
    React.$ajax
      .postData('/api/cmdMonitor/listGridTask', {...params})
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
            <Link to="/app/monitoring/grid/addGrid">
              <Icon type="plus" style={{marginRight: 5}} />
              新建网格搜捕任务
            </Link>
          </Button>
          <Button onClick={this.handleReact}>复位</Button>
        </div>
        <Table
          rowKey={(row) => {
            return 'key-' + row.id;
          }}
          loading={this.state.loading}
          columns={tableHeader(this.handleViewMap)}
          dataSource={this.state.data}
          bordered
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
export default withRouter(GridRaidTaskTable);
