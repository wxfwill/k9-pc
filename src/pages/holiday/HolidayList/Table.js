import React, {Component} from 'react';
import {Table, Button, Icon, Popconfirm, message} from 'antd';
import {Link, withRouter} from 'react-router-dom';
import Immutable from 'immutable';
class HolidayTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      pageSize: 10,
      currPage: 1,
      selectedRowKeys: []
    };
  }
  componentWillMount() {
    this.fetch();
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
        ...filter
      });
    });
  }
  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});
    React.$ajax
      .postData('/api/leaveRecord/getLeaveUser', {...params})
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
  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current
    });
  };
  onSelectChange = (selectedRowKeys) => {
    //console.log(selectedRowKeys)
    this.setState({selectedRowKeys});
  };

  addInfo = () => {
    sessionStorage.setItem('formStatus', 'add');
    sessionStorage.setItem('singleUserId', '');
  };
  //查看
  viewDetail = (record) => {
    sessionStorage.setItem('singleUserId', record.id);
    sessionStorage.setItem('formStatus', 'view');
  };
  editInfo = (record) => {
    sessionStorage.setItem('singleUserId', record.id);
    sessionStorage.setItem('formStatus', 'edit');
  };
  render() {
    const {dataSource, loading, pagination, selectedRowKeys} = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys
    };
    const columns = [
      {
        title: '年份',
        dataIndex: 'leaveYear',
        key: 'leaveYear'
      },
      {
        title: '警员姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '职务',
        dataIndex: 'dutyName',
        key: 'dutyName'
      },
      {
        title: '假期类型',
        dataIndex: 'typeName',
        key: 'typeName'
      },
      {
        title: '总天数',
        dataIndex: 'totalDay',
        key: 'totalDay'
      },
      {
        title: '已用天数',
        dataIndex: 'usedDay',
        key: 'usedDay'
      },
      {
        title: '流程中天数',
        dataIndex: 'applyingDay',
        key: 'applyingDay'
      },
      {
        title: '剩余天数',
        dataIndex: 'day1',
        key: 'day1',
        render: (text, record, index) => {
          return <span>{Number(record.totalDay) - Number(record.usedDay)}</span>;
        }
      },
      ,
      {
        title: '可用天数',
        dataIndex: 'day2',
        key: 'day2',
        render: (text, record, index) => {
          return <span>{Number(record.totalDay) - Number(record.usedDay) - Number(record.applyingDay)}</span>;
        }
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        render: (text, record, index) => {
          return (
            <div>
              <span style={{cursor: 'pointer', color: '#1890ff'}}>
                <Link to={{pathname: '/app/holiday/holidayListView', query: {record: record, detailsFlag: true}}}>
                  <span style={{cursor: 'pointer', color: '#1890ff'}}>
                    <Icon type="eye" style={{margin: '0 10px'}} />
                    查看
                  </span>
                </Link>
              </span>
              <Link to={{pathname: '/app/holiday/holidayListEdit', query: {record: record, detailsFlag: false}}}>
                <span style={{cursor: 'pointer', color: '#1890ff'}}>
                  <Icon type="edit" style={{margin: '0 10px'}} />
                  编辑
                </span>
              </Link>
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <div style={{marginBottom: '20px'}}>
          <Button type="primary" style={{marginRight: '20px'}} onClick={this.addInfo}>
            <Link to={{pathname: '/app/holiday/holidayListAdd', query: {targetText: '新增'}}}>新增</Link>
          </Button>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>*/}
        </div>
        <Table
          key="holidayList"
          dataSource={this.state.dataSource}
          columns={columns}
          loading={loading}
          onChange={this.handleTableChange}
          pagination={pagination}
          bordered
          rowKey="id"
          //       rowSelection={rowSelection}
        />
      </div>
    );
  }
}
export default withRouter(HolidayTable);
