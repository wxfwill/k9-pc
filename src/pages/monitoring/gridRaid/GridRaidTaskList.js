import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';
import {connect} from 'react-redux';
import CustomTable from 'components/table/CustomTable';
import {tableHeader} from './GridRaidTaskTableHeader';
import GRTaskSearch from './GridRaidTaskSearch';
import {changeMapType} from 'store/actions/common.js';

@connect(
  (state) => ({navData: state.commonReducer.navData}),
  (dispatch) => ({changeGridMap: (bool) => dispatch(changeMapType(bool))})
)
class GridRaidTaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null,
      dataSource: [],
      loading: false,
      param: {
        endDate: '',
        startDate: '',
        taskName: ''
      },
      sortFieldName: '',
      sortType: 'desc',
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  }
  componentDidMount() {
    // React.store.dispatch({type: 'NAV_DATA', nav: ['指挥作战', '网格化搜捕']});
    const {param, sortFieldName, sortType, pagination} = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
  }
  handleLimit = (limit) => {
    console.log(limit);
    console.log('filter');
    let obj = Object.assign({}, this.state.param, limit);
    this.setState({param: obj}, () => {
      const {param, sortFieldName, sortType, pagination} = this.state;
      this.getListData(param, sortFieldName, sortType, pagination);
    });
  };
  handleChangeSize = (page) => {
    this.tableChange({currPage: page, current: page});
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({currPage: cur, pageSize: size, current: cur});
  };
  tableChange = (obj) => {
    if (!util.isObject(obj)) {
      throw new Error(`${obj} must is an object`);
    }
    const per = Object.assign({}, this.state.pagination, obj);
    this.setState({pagination: per}, () => {
      const {param, sortFieldName, sortType, pagination} = this.state;
      this.getListData(param, sortFieldName, sortType, pagination);
    });
  };
  getListData = (param, sortFieldName, sortType, pagination) => {
    const newObj = Object.assign({}, {param, sortFieldName, sortType}, pagination);
    this.setState({loading: true});
    React.$ajax.postData('/api/grid-hunting/page', newObj).then((res) => {
      if (res && res.code === 0) {
        const resData = res.data;
        const newList = resData.list ? resData.list : [];
        const pagination = {...this.state.pagination};
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        this.setState({dataSource: newList, loading: false, pagination});
      }
    });
  };
  handleViewMap = (row) => {
    console.log(row);
    this.props.changeGridMap(true);
    // this.props.history.push('/app/monitoring/grid/viewMap');
    window.open(`${process.env.BASE_WEB_URL}/#/app/monitoring/grid/viewMap?taskId=${row.id}`);
  };
  render() {
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <GRTaskSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <CustomTable
                setTableKey={(row) => {
                  return 'key-' + row.id;
                }}
                dataSource={this.state.dataSource}
                pagination={this.state.pagination}
                loading={this.state.loading}
                columns={tableHeader(this.handleViewMap)}
                isBordered
                isRowSelects={false}
                handleChangeSize={this.handleChangeSize}
                handleShowSizeChange={this.handleShowSizeChange}></CustomTable>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GridRaidTaskList;
