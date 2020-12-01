import React, { Component } from 'react';
import { Card, message } from 'antd';
import Search from './Search';
import { tableHeaderLabel1 } from 'localData/reportManage/tableHeader';
import ExportFileHoc from 'components/exportFile/exportFileHoc';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');
import EditModel from './EditModel';
import moment from 'moment';

class FourReportListSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      param: {
        // arrest: null,
        taskType: null,
        groupId: null,
        // isFeedback: null,
        endDate: null,
        startDate: null,
        // carDest: null,
        userId: null,
      },
      personnelTree: [],
      personnelTree1: [],
      personnelTree2: [],
      taskTypeList: [],
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
    // React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '用车信息列表'] });
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
    // 查询用户
    this.queryGroupUser('', 'all');
    // 任务类型
    this.queryTaskType('cqyc');
  }
  exportExcel = (data) => {
    this.handleSearchData(data, this.handleExport);
  };
  queryTaskType = (rootCode) => {
    React.$ajax.common.queryRulesByRootCode({ rootCode }).then((res) => {
      if (res.code == 0) {
        this.setState({ taskTypeList: res.data });
      }
    });
  };
  handleExport = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    this.props.exportExcel('/api/report/exportReportAttendanceCar', newObj);
    return true;
  };
  handleEditInfo = (row) => {
    // console.log(row);
    this.childCar.openModel(row.id);
  };
  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };
  editFormData = (per) => {
    React.$ajax.postData('/api/report/createCarUseReport', { ...per }).then((res) => {
      if (res && res.code == 0) {
        this.childCar.handleCancel();
        message.info('编辑成功');
        let { param, sortFieldName, sortType, pagination } = this.state;
        this.getListData(param, sortFieldName, sortType, pagination);
      }
    });
  };
  handleSearchData = (data, methods) => {
    let { pagination } = this.state;
    let per = data || {};
    let _pagination;
    per.taskType = per.taskType ? per.taskType : null;
    per.groupId = per.groupId ? Number(per.groupId) : null;
    per.userId = per.userId ? Number(per.userId) : null;
    per.endDate = per.endDate ? moment(per.endDate).format('x') : null;
    per.startDate = per.startDate ? moment(per.startDate).format('x') : null;
    // per.carDest = per.carDest ? per.carDest : null;

    let newObj = Object.assign({}, this.state.param, per);
    _pagination = Object.assign({}, pagination, { current: 1, currPage: 1, pageSize: 10 });
    this.setState({ param: newObj, pagination: _pagination }, () => {
      let { param, sortFieldName, sortType, pagination } = this.state;
      methods(param, sortFieldName, sortType, pagination) ||
        this.getListData(param, sortFieldName, sortType, pagination);
    });
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
    React.$ajax.postData('/api/report/pageReportAttendanceCar', newObj).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        let newList = resData.list ? resData.list : [];
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        this.setState({ dataSource: newList, loading: false, pagination });
      }
    });
  };
  queryGroupUser = util.Debounce(
    (keyword, title) => {
      React.$ajax.common.queryGroupUser({ keyword }).then((res) => {
        if (res.code == 0) {
          let resObj = res.data;
          let arr = [];
          for (let key in resObj) {
            if (resObj[key] && resObj[key].length > 0) {
              arr.push({
                name: key,
                children: resObj[key],
              });
            }
          }
          if (title == 'leader') {
            this.setState({ personnelTree1: arr });
          } else if (title == 'name') {
            this.setState({ personnelTree: arr });
          } else if (title == 'collage') {
            this.setState({ personnelTree2: arr });
          } else {
            this.setState({ personnelTree: arr, personnelTree1: arr, personnelTree2: arr });
          }
        }
      });
    },
    300,
    false
  );
  render() {
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search
            handleSearchData={this.handleSearchData}
            personnelTree={this.state.personnelTree}
            queryGroupUser={this.queryGroupUser}
            taskTypeList={this.state.taskTypeList}
            exportExcel={this.exportExcel}
          />
        </Card>
        <EditModel
          onRef={(ref) => (this.childCar = ref)}
          taskTypeList={this.state.taskTypeList}
          personnelTree2={this.state.personnelTree2}
          personnelTree1={this.state.personnelTree1}
          personnelTree={this.state.personnelTree}
          queryGroupUser={this.queryGroupUser}
          editFormData={this.editFormData}
        ></EditModel>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.id + row.applyUser;
            }}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            loading={this.state.loading}
            columns={tableHeaderLabel1(this.handleEditInfo)}
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

export default ExportFileHoc()(FourReportListSearch);
