import React, { Component } from 'react';
import { Card, Button, message } from 'antd';
import Search from './Search';
import { leaveInformationDetal } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');
import moment from 'moment';
import EditModel from './EditModel';
import ExportFileHoc from 'components/exportFile/exportFileHoc';

class LeaveInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      personnelTree: [],
      loading: false,
      sortFieldName: null,
      sortType: 'desc',
      id: null,
      param: {
        destination: null,
        leaveType: null,
        endDate: null,
        startDate: null,
        groupIds: [],
        userIds: [],
      },
      pagination: {
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
      leaveType: [],
    };
  }
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '请假信息查询'] });
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
    // 请假类型
    this.getQjData();
    // 姓名
    this.queryGroupUser('');
  }
  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };
  handleSearchData = (data) => {
    let per = data;
    per.groupIds = per.groupIds != null ? [Number(per.groupIds)] : [];
    per.userIds = per.userIds != null ? [Number(per.userIds)] : [];
    per.destination = per.destination != null ? per.destination : null;
    per.leaveType = per.leaveType != null ? per.leaveType : null;
    per.endDate = per.endDate ? moment(per.endDate).format('YYYY-MM-DD') : null;
    per.startDate = per.startDate ? moment(per.startDate).format('YYYY-MM-DD') : null;
    let newObj = Object.assign({}, this.state.param, per);
    console.log(newObj);
    this.setState({ param: newObj }, () => {
      let { param, sortFieldName, sortType, pagination } = this.state;
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
    React.$ajax.postData('/api/leaveAfterSync/getPageLeaveAfterSync', newObj).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        this.setState({ dataSource: resData.list, loading: false, pagination });
      }
    });
  };
  exportLeaveLiust = (data) => {
    let per = data;
    per.groupIds = per.groupIds != null ? [Number(per.groupIds)] : [];
    per.userIds = per.userIds != null ? [Number(per.userIds)] : [];
    per.destination = per.destination != null ? per.destination : null;
    per.leaveType = per.leaveType != null ? per.leaveType : null;
    per.endDate = per.endDate ? moment(per.endDate).format('YYYY-MM-DD') : null;
    per.startDate = per.startDate ? moment(per.startDate).format('YYYY-MM-DD') : null;
    let newObj = Object.assign({}, this.state.param, per);
    this.setState({ param: newObj }, () => {
      let { param, sortFieldName, sortType, pagination } = this.state;
      let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);

      this.props.exportExcel('/api/leaveAfterSync/exportLeaveAfterSyncInfo', newObj);
      return true;

      // React.$ajax.fileDataPost('/api/leaveAfterSync/exportLeaveAfterSyncInfo', newObj).then((res) => {
      //   let name = `请假信息列表.xlsx`;
      //   util.createFileDown(res, name);
      // });
    });
  };
  queryGroupUser = util.Debounce(
    (keyword) => {
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
          console.log('arr');
          console.log(arr);
          this.setState({ personnelTree: arr });
        }
      });
    },
    300,
    false
  );
  // 请假类型
  getQjData = () => {
    React.$ajax.getData('/api/integral-rule/queryRulesByRootCode', { rootCode: 'qjType' }).then((res) => {
      if (res && res.code == 0) {
        console.log(res);
        this.setState({ leaveType: res.data[0].children });
      }
    });
  };
  editFormData = (data) => {
    console.log(data);
    let { destination, endDate, leaveTime, leaveType, reason, startDate, userName } = data;
    let per = {
      destination,
      id: this.state.id,
      endDate: moment(endDate).format('x'),
      leaveTime: Number(leaveTime),
      leaveType,
      reason,
      startDate: moment(startDate).format('x'),
      userName,
    };
    React.$ajax.postData('/api/leaveAfterSync/editLeaveAfterSyncInfo', per).then((res) => {
      if (res && res.code == 0) {
        message.info('编辑成功');
        this.child.handleCancel();
        let { param, sortFieldName, sortType, pagination } = this.state;
        this.getListData(param, sortFieldName, sortType, pagination);
      }
    });
  };
  showEditModel = (row) => {
    this.setState({ id: row.id });
    this.child.openModel(row.id);
  };
  render() {
    const { dataSource, pagination, loading } = this.state;
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search
            userArr={this.state.personnelTree}
            queryGroupUser={this.queryGroupUser}
            handleSearchData={this.handleSearchData}
            leaveType={this.state.leaveType}
            exportLeaveLiust={this.exportLeaveLiust}
          />
        </Card>
        <EditModel
          onRef={(ref) => (this.child = ref)}
          editFormData={this.editFormData}
          leaveType={this.state.leaveType}
        ></EditModel>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.id + row.userName;
            }}
            dataSource={dataSource}
            pagination={pagination}
            loading={loading}
            columns={leaveInformationDetal(this.showEditModel)}
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

export default ExportFileHoc()(LeaveInformation);
