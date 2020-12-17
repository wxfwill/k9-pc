import React, { Component } from 'react';
import { Card, Button } from 'antd';
import Search from './Search';
import { AwardInformationDetal } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');
import moment from 'moment';
import EditModel from './EditModel';
import ExportFileHoc from 'components/exportFile/exportFileHoc';

class AwardInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      sortFieldName: null,
      sortType: 'desc',
      id: null,
      param: {
        rewardType: null,
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
    };
  }
  componentDidMount() {
    // React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '奖励信息查询'] });
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
  }
  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
  };
  handleSearchData = (data, init) => {
    console.log(data);
    let per = data || {};
    per.userIds = per.userIds ? [per.userIds] : [];
    per.groupIds = per.groupIds ? [per.groupIds] : [];
    per.endDate = per.endDate ? moment(per.endDate).format('YYYY-MM-DD') : null;
    per.startDate = per.startDate ? moment(per.startDate).format('YYYY-MM-DD') : null;
    per.rewardType = per.rewardType ? per.rewardType : null;
    let newObj = Object.assign({}, this.state.param, per);
    this.setState({ param: newObj }, () => {
      let { param, sortFieldName, sortType, pagination } = this.state;
      init(param, sortFieldName, sortType, pagination) || this.getListData(param, sortFieldName, sortType, pagination);
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
    React.$ajax.postData('/api/reward/getPageRewardSync', { ...newObj }).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        this.setState({ dataSource: resData.list, loading: false, pagination });
      }
    });
  };
  handleExportData = (data) => {
    this.handleSearchData(data, this.exportExcel);
  };
  exportExcel = (param, sortFieldName, sortType, pagination) => {
    let newObj = Object.assign({}, { param, sortFieldName, sortType }, pagination);
    this.props.exportExcel('/api/reward/exportRewardSyncInfo', newObj);
    return true;
    // React.$ajax.fileDataPost('/api/reward/exportRewardSyncInfo', { ...newObj }).then((res) => {
    //   let name = `奖励信息列表.xlsx`;
    //   util.createFileDown(res, name);
    // });
    // return true;
  };
  editFormData = (data) => {
    React.$ajax.postData('/api/reward/editRewardSyncInfo', { ...data }).then((res) => {
      if (res && res.code == 0) {
        this.child.handleCancel();
        let { param, sortFieldName, sortType, pagination } = this.state;
        this.getListData(param, sortFieldName, sortType, pagination);
      }
    });
  };
  handleEditInfo = (row) => {
    this.child.openModel(row);
  };

  render() {
    const { dataSource, pagination, loading, columns } = this.state;
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search handleSearchData={this.handleSearchData} handleExportData={this.handleExportData} />
        </Card>
        <EditModel onRef={(ref) => (this.child = ref)} editFormData={this.editFormData}></EditModel>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return 'key-' + row.userId + row.repTime;
            }}
            dataSource={dataSource}
            pagination={pagination}
            loading={loading}
            columns={AwardInformationDetal(this.handleEditInfo)}
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

export default ExportFileHoc()(AwardInformation);
