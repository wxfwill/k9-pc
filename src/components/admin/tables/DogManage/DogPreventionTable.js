import React, { Component } from 'react';
import { Table, Button, Icon, Popconfirm, message, Tag } from 'antd';
import moment from 'moment';
import Immutable from 'immutable';
import { Link, withRouter } from 'react-router-dom';
class DogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 10,
      currPage: 1,
      selectedRowKeys: [],
    };
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    let filter = nextProps.filter;
    let _this = this;
    this.setState({ filter: filter }, function () {
      _this.fetch({
        pageSize: _this.state.pageSize,
        currPage: 1,
        name: filter && filter.name,
        status: filter && filter.status,
      });
    });
  }
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    this.setState({ loading: true });
    React.$ajax.postData('/api/vaccineRecord/listVaccinePlan', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({ dataSource: res.list, loading: false, pagination });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    let { filter } = this.state;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...filter,
    });
  };
  onSelectChange = (selectedRowKeys) => {
    //console.log(selectedRowKeys)
    this.setState({ selectedRowKeys });
  };
  renderVaccineType = (type) => {
    switch (type) {
      case 1:
        return '掉毛';
      case 2:
        return '蛔虫';
      case 3:
        return '发热';
      case 4:
        return '搜箱包';
      case 5:
        return '追踪';
      default:
        type;
    }
  };
  //删除犬只
  deleteDogs = (record, index) => {
    let { pagination } = this.state;
    React.$ajax.postData('/api/vaccineRecord/deletePlanByIds', { ids: [record.id] }).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        this.fetch({
          pageSize: pagination.pageSize,
          currPage: pagination.current,
        });
      } else {
        message.serror('删除失败');
      }
    });
  };
  //批量删除
  deleteMore = () => {
    const { selectedRowKeys, pagination } = this.state;
    if (selectedRowKeys.length < 1) {
      message.warn('请选择要删除的犬只');
    } else {
      React.$ajax.postData('/api/vaccineRecord/deletePlanByIds', { ids: selectedRowKeys }).then((res) => {
        if (res.code == 0) {
          message.success('删除成功');
          this.setState({ selectedRowKeys: [] });
          this.fetch({
            pageSize: pagination.pageSize,
            currPage: pagination.current,
          });
        } else {
          message.error('删除失败');
        }
      });
    }
  };
  addInfo = () => {
    sessionStorage.setItem('formStatus', 'add');
    sessionStorage.setItem('dogId', '');
  };
  //查看
  viewDetail = (record) => {
    const { history } = this.props;
    const role = this.props.location.pathname.indexOf('app') > 0 ? 'app' : 'view';
    history.push({
      pathname: `/${role}/dog/preventionView`,
      query: {
        id: record.id,
        targetText: '查看',
      },
    });
  };
  editInfo = (record) => {
    sessionStorage.setItem('dogId', record.dogId);
    sessionStorage.setItem('formStatus', 'edit');
  };
  render() {
    const { dataSource, loading, pagination, selectedRowKeys } = this.state;
    const role = this.props.location.pathname.indexOf('app') > 0 ? 'app' : 'view';
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (id) => {
          return <Tag color="blue">{id}</Tag>;
        },
      },
      {
        title: '计划名称',
        dataIndex: 'name',
      },
      {
        title: '药物名称',
        dataIndex: 'vaccineTypeNames',
        // render:(text)=>{
        //   return this.renderVaccineType(text)
        // }
      },
      {
        title: '计划时间',
        dataIndex: 'planDate',
        render: (text, record, index) => {
          return moment(text).format('YYYY-MM-DD');
        },
      },
      {
        title: '执行日期',
        dataIndex: 'excuteDate',
        render: (text, record, index) => {
          if (text) {
            return moment(text).format('YYYY-MM-DD');
          }
          return '--';
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record, index) => {
          return text == 0 ? '未执行' : '已执行';
        },
      },
      // {
      //   title:'下次疫苗提醒时间',
      //   dataIndex:'nextVaccineRemindingTime',
      //   render:(text,record,index)=>{
      //     return moment(text).format('YYYY-MM-DD')
      //   }
      // }, /app/dog/preventionTodo
      {
        title: '操作',
        dataIndex: 'opreation',
        render: (text, record, index) => {
          return (
            <div>
              {record.status == 1 ? (
                <span
                  style={{ cursor: 'auto', color: 'rgb(208, 215, 222)', display: 'inline-block', marginRight: '10px' }}
                >
                  执行
                </span>
              ) : (
                <Link to={{ pathname: `/${role}/dog/preventionTodo`, query: { record: record, targetText: '编辑' } }}>
                  <span style={{ cursor: 'pointer', color: '#1890ff', display: 'inline-block', marginRight: '10px' }}>
                    执行
                  </span>
                </Link>
              )}

              <span style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => this.viewDetail(record)}>
                查看
              </span>
              {record.status == 1 ? (
                <Icon type="edit" style={{ cursor: 'auto', color: 'rgb(208, 215, 222)', margin: '0 10px' }} />
              ) : (
                <Link to={{ pathname: `/${role}/dog/preventionEdit`, query: { record: record, targetText: '编辑' } }}>
                  <Icon
                    type="edit"
                    style={{ cursor: 'pointer', color: '#1890ff', margin: '0 10px' }}
                    onClick={() => this.editInfo(record)}
                  />
                </Link>
              )}

              <Popconfirm title="确认删除此计划信息?" onConfirm={() => this.deleteDogs(record)}>
                <Icon type="delete" style={{ cursor: 'pointer', color: '#1890ff' }} />
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <Button type="primary" style={{ marginRight: '20px' }} onClick={this.addInfo}>
            <Link to={{ pathname: '/app/dog/preventionAdd' }}>新增防治记录</Link>
          </Button>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>*/}

          <Popconfirm title="确认要批量删除吗?" onConfirm={this.deleteMore}>
            <Button>批量删除</Button>
          </Popconfirm>
        </div>
        <Table
          dataSource={this.state.dataSource}
          columns={columns}
          loading={loading}
          onChange={this.handleTableChange}
          pagination={pagination}
          bordered
          rowKey="id"
          rowSelection={rowSelection}
        />
      </div>
    );
  }
}
export default withRouter(DogTable);

// WEBPACK FOOTER //
// ./src/components/admin/tables/DogManage/DogPreventionTable.js
