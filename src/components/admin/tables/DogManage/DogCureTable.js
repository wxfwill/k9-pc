import React, { Component } from 'react';
import { Table, Button, Icon, Popconfirm, message, Tag, Badge } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Immutable from 'immutable';

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
      pageSize: 2,
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
        ...filter,
      });
    });
  }
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    this.setState({ loading: true });
    React.$ajax
      .postData('/api/treatmentRecord/list', { ...params })
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
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
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
    React.$ajax.postData('/api/treatmentRecord/deleteByIds', { ids: [record.id] }).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        this.fetch(
          {
            pageSize: pagination.pageSize,
            currPage: 1,
            dataSource: [],
          },
          this.fetch()
        );
      } else {
        message.serror('删除失败');
      }
    });
  };
  //批量删除
  deleteMore = () => {
    const { selectedRowKeys, pagination } = this.state;
    if (selectedRowKeys.length < 1) {
      message.warn('请选择要删除的治疗记录');
    } else {
      React.$ajax.postData('/api/treatmentRecord/deleteByIds', { ids: selectedRowKeys }).then((res) => {
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
    sessionStorage.setItem('recordId', record.dogId);
    sessionStorage.setItem('formStatus', 'view');
  };
  editInfo = (record) => {
    // const {history}=this.props;
    // history.push({pathname:'/app/dog/cureEdit', query: { dogId: record.dogId,formStatus:'edit' }})

    sessionStorage.setItem('recordId', record.dogId);
    sessionStorage.setItem('formStatus', 'edit');
  };
  render() {
    const pathname = this.props.pathname.indexOf('app') >= 0 ? 'app' : 'view';
    const { dataSource, loading, pagination, selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (id, record, index) => {
          return (
            <Badge
              count={index + 1}
              style={{
                minWidth: '50px',
                fontSize: '12px',
                height: '16px',
                lineHeight: '16px',
                backgroundColor: '#99a9bf',
              }}
            />
          );
        },
      },
      {
        title: '发病日期',
        dataIndex: 'morbidityTime',
        key: 'morbidityTime',
        render: (time) => {
          return moment(time).format('YYYY-MM-DD');
        },
      },
      {
        title: '犬名',
        dataIndex: 'dogName',
        key: 'dogName',
      },
      {
        title: '发病症状',
        dataIndex: 'symptom',
        key: 'symptom',
      },
      {
        title: '诊断结果',
        dataIndex: 'treatmentResults',
        key: 'treatmentResults',
        render: (result) => {
          let resArr = [<Tag color="#2db7f5">痊&nbsp;&nbsp;&nbsp;愈</Tag>, <Tag color="#f50">未痊愈</Tag>];
          return resArr[result - 1];
        },
      },
      {
        title: '兽医',
        dataIndex: 'veterinaryName',
        key: 'veterinaryName',
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        render: (text, record, index) => {
          return (
            <div>
              <span style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => this.viewDetail(record)}>
                <Link
                  to={{ pathname: `/${pathname}/dog/cureView`, query: { dogId: record.dogId, targetText: '查看' } }}
                >
                  <Icon type="eye" style={{ cursor: 'pointer', color: '#1890ff', margin: '0 10px' }} />
                </Link>
              </span>
              <Link to={{ pathname: `/${pathname}/dog/cureEdit`, query: { dogId: record.dogId, targetText: '编辑' } }}>
                <Icon
                  type="edit"
                  style={{ cursor: 'pointer', color: '#1890ff', margin: '0 10px' }}
                  onClick={() => this.editInfo(record)}
                />
              </Link>
              <Popconfirm title="确认删除此犬病治疗信息?" onConfirm={() => this.deleteDogs(record)}>
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
            <Link to={{ pathname: `/${pathname}/dog/cureAdd`, query: { targetText: '新增' } }}>新增治疗记录</Link>
          </Button>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>*/}
          <Button onClick={this.deleteMore}>批量删除</Button>
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
export default DogTable;
