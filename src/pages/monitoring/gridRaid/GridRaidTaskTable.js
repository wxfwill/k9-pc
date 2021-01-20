import React from 'react';
import {Table} from 'antd';
import {withRouter} from 'react-router-dom';

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
      param: {
        endDate: '',
        startDate: '',
        taskName: ''
      },
      firstLoad: true,
      pageSize: 5,
      currPage: 1,
      data: [],
      loading: false
    };
  }

  UNSAFE_componentWillMount() {
    this.fetch();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    const isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      const filter = nextProps.filter;
      const _this = this;
      this.setState({firstLoad: true});
      console.log(filter);
      this.setState({filter}, function () {
        let {filter} = this.state;
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          param: filter
        });
      });
    }
  }
  // handleReact = () => {
  //   this.props.changeGridMap(false);
  // };
  handleViewMap = (row) => {
    console.log(row);
    this.props.changeGridMap(true);
    // this.props.history.push('/app/monitoring/grid/viewMap');
    window.open(`${process.env.BASE_WEB_URL}/#/app/monitoring/grid/viewMap`);
  };
  handleTableChange = (pagination) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    const {filter} = this.state;
    this.setState({
      pagination: pager
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      param: filter
    });
  };
  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage, param: this.state.param}) {
    this.setState({loading: true});
    React.$ajax
      .postData('/api/grid-hunting/page', {...params})
      .then((res) => {
        const pagination = {...this.state.pagination};
        let resData = res.data;
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        // pagination.pageSize = resData.pageSize;
        console.log(resData.list);
        this.setState({data: resData.list, loading: false, pagination});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    //   const { match } = this.props;
    return (
      <div>
        {/* <div className="table-operations">
          <Button type="primary">
            <Link to="/app/monitoring/grid/addGrid">
              <Icon type="plus" style={{marginRight: 5}} />
              新建网格搜捕任务
            </Link>
          </Button>
          <Button onClick={this.handleReact}>复位</Button>
        </div> */}
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
