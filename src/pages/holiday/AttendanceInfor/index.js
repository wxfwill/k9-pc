import React, {Component} from 'react';
import {Card, message} from 'antd';
import ExportFileHoc from 'components/exportFile/exportFileHoc';
import CustomTable from 'components/table/CustomTable';
import Search from './components/Search';
import * as tableHeader from 'localData/holiday/tableHeader';
import moment from 'moment';
class AttendanceInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      param: {
        clockType: null,
        endDate: null,
        startDate: null,
        userIds: null
      },
      loading: false,
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      personnelTree: [],
      taskTypeList: []
    };
  }
  componentDidMount() {
    const {param, sortFieldName, sortType, pagination} = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
    // 查询用户
    this.queryGroupUser('', 'all');
  }
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
  exportExcel = (data) => {
    this.handleSearchData(data, this.handleExport);
  };
  handleExport = (param, sortFieldName, sortType, pagination) => {
    const newObj = Object.assign({}, {param, sortFieldName, sortType}, pagination);
    this.props.exportExcel('/api/clock/exportPageCommuting', newObj);
    return true;
  };
  handleSearchData = (data, methods) => {
    const {pagination} = this.state;
    const per = data || {};
    let _pagination;
    per.clockType = per.clockType ? per.clockType : null;
    per.userIds = per.userIds ? per.userIds : null;
    per.endDate = per.endDate ? moment(per.endDate).format('x') : null;
    per.startDate = per.startDate ? moment(per.startDate).format('x') : null;

    const newObj = Object.assign({}, this.state.param, per);
    _pagination = Object.assign({}, pagination, {current: 1, currPage: 1, pageSize: 10});
    this.setState({param: newObj, pagination: _pagination}, () => {
      const {param, sortFieldName, sortType, pagination} = this.state;
      methods(param, sortFieldName, sortType, pagination) ||
        this.getListData(param, sortFieldName, sortType, pagination);
    });
  };
  getListData = (param, sortFieldName, sortType, pagination) => {
    const newObj = Object.assign({}, {param, sortFieldName, sortType}, pagination);
    this.setState({loading: true});
    React.$ajax.postData('/api/clock/pageCommuting', newObj).then((res) => {
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
  queryGroupUser = util.Debounce(
    (keyword, title) => {
      React.$ajax.common.queryGroupUser({keyword}).then((res) => {
        if (res.code == 0) {
          const resObj = res.data;
          const arr = [];
          for (const key in resObj) {
            if (resObj[key] && resObj[key].length > 0) {
              arr.push({
                name: key,
                children: resObj[key]
              });
            }
          }
          if (title == 'leader') {
            this.setState({personnelTree1: arr});
          } else if (title == 'name') {
            this.setState({personnelTree: arr});
          } else if (title == 'collage') {
            this.setState({personnelTree2: arr});
          } else {
            this.setState({personnelTree: arr, personnelTree1: arr, personnelTree2: arr});
          }
        }
      });
    },
    200,
    false
  );
  render() {
    return (
      <div>
        <Card title="按条件搜索" bordered={false}>
          <Search
            handleSearchData={this.handleSearchData}
            personnelTree={this.state.personnelTree}
            queryGroupUser={this.queryGroupUser}
            taskTypeList={this.state.taskTypeList}
            exportExcel={this.exportExcel}
          />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.id + row.applyUser;
            }}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            loading={this.state.loading}
            columns={tableHeader.AttendanceInfor}
            isBordered
            isRowSelects={false}
            handleChangeSize={this.handleChangeSize}
            handleShowSizeChange={this.handleShowSizeChange}></CustomTable>
        </Card>
      </div>
    );
  }
}
export default ExportFileHoc()(AttendanceInfor);
