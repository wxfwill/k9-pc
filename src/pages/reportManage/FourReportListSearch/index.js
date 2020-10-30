import React, { Component } from 'react';
import { Card } from 'antd';
import Search from './Search';
import { tableHeaderLabel } from 'localData/reportManage/tableHeader';
import CustomTable from 'components/table/CustomTable';
require('style/fourReport/reportList.less');

class FourReportListSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: tableHeaderLabel,
      loading: false,
      param: {
        arrest: null,
        categoryIds: [],
        groupId: [],
        isFeedback: null,
        repDateEnd: null,
        repDateStart: null,
        taskLocation: null,
        userName: '',
      },
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
    let { param, sortFieldName, sortType, pagination } = this.state;
    this.getListData(param, sortFieldName, sortType, pagination);
  }
  handleChangeSize = (page) => {
    this.tableChange({ currPage: page, current: page });
  };
  handleShowSizeChange = (cur, size) => {
    this.tableChange({ currPage: cur, pageSize: size, current: cur });
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
    React.httpAjax('post', config.apiUrl + '/api/report/page4wReportInfo', { ...newObj }).then((res) => {
      if (res && res.code === 0) {
        let resData = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total = resData.totalCount;
        pagination.current = resData.currPage;
        this.setState({ dataSource: resData.list, loading: false, pagination });
      }
    });
  };
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '人员名称',
        dataIndex: 'userName',
      },
      {
        title: '任务时间',
        dataIndex: 'repTime',
      },
      {
        title: '来源',
        dataIndex: 'source',
      },
      {
        title: '任务类型',
        dataIndex: 'category',
      },
      {
        title: '地点',
        dataIndex: 'taskLocation',
      },
      {
        title: '详细情况',
        dataIndex: 'repDetail',
      },
      {
        title: '抓捕人数',
        dataIndex: 'arrestNum',
      },
      {
        title: '是否反馈',
        dataIndex: 'isFeedback',
      },
      {
        title: '反馈详情',
        dataIndex: 'feedbackContext',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    return (
      <div className="four-wrap">
        <Card title="按条件搜索" bordered={false}>
          <Search />
        </Card>
        <Card bordered={false}>
          <CustomTable
            setTableKey={(row) => {
              return row.userId;
            }}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            loading={this.state.loading}
            columns={this.state.columns}
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

export default FourReportListSearch;
