import React, {Component} from 'react';
import {Table, Button, Icon, Popconfirm, message} from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
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
      // console.log(filter, 'filter')
      _this.fetch({
        pageSize: _this.state.pageSize,
        currPage: 1,
        ...filter
      });
    });
  }
  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});
    httpAjax('post', config.apiUrl + '/api/material/listCarPage', {...params})
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
  //删除
  deleteDogs = (record, index) => {
    const {pagination} = this.state;
    httpAjax('post', config.apiUrl + '/api/material/deleteCarByIds', {ids: [record.id]}).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        this.fetch({
          pageSize: pagination.pageSize,
          currPage: pagination.current
        });
      } else {
        message.serror('删除失败');
      }
    });
  };
  //批量删除
  deleteMore = () => {
    const {selectedRowKeys, pagination} = this.state;
    if (selectedRowKeys.length < 1) {
      message.warn('请选择要删除的车辆');
    } else {
      httpAjax('post', config.apiUrl + '/api/material/deleteCarByIds', {ids: selectedRowKeys}).then((res) => {
        if (res.code == 0) {
          message.success('删除成功');
          this.fetch({
            pageSize: pagination.pageSize,
            currPage: pagination.current
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
    sessionStorage.setItem('dogId', record.id);
    sessionStorage.setItem('formStatus', 'view');
  };
  editInfo = (record) => {
    sessionStorage.setItem('dogId', record.id);
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
        title: '编号',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '品牌',
        dataIndex: 'brand'
      },
      {
        title: '车类型',
        dataIndex: 'useage',
        render: (record) => (record == 1 ? '运犬车' : '公务车')
      },
      {
        title: '车型',
        dataIndex: 'type',
        render: (record) => (record == 1 ? '小车' : record == 2 ? '中巴' : '大巴')
      },
      {
        title: '车牌',
        dataIndex: 'number'
      },
      {
        title: '状态',
        dataIndex: 'inOrOut'
      },
      {
        title: '备注',
        dataIndex: 'remark'
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        render: (text, record, index) => {
          // console.log(text, record, index)
          return (
            <div>
              {/* <span style={{cursor: "pointer",color:'#1890ff'}} onClick={()=>this.viewDetail(record)}>
              <Link to={{pathname:'/app/video/infoDetail', query: { VideoId: record.id,targetText:'查看' }}}>查看</Link>
            </span> */}
              <Link to={{pathname: '/app/equipment/carInfoEdit', query: {record: record, targetText: '编辑'}}}>
                <Icon
                  type="edit"
                  style={{cursor: 'pointer', color: '#1890ff', margin: '0 10px'}}
                  // onClick={()=>this.editInfo(record)}
                />
                编辑
              </Link>
              <Popconfirm title="确认删除此车辆?" onConfirm={() => this.deleteDogs(record)}>
                <Icon type="delete" style={{cursor: 'pointer', color: '#1890ff', margin: '0 10px 0 20px'}} />
                <span style={{color: '#1890ff'}}>删除</span>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <div style={{marginBottom: '20px'}}>
          <Button type="primary" style={{marginRight: '20px'}} onClick={this.addInfo}>
            <Link to={{pathname: '/app/equipment/carInfoAdd', query: {targetText: '新增'}}}>新增车辆</Link>
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
