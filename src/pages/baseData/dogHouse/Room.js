import React, { Component } from 'react';
import { Row, Col, Card, Icon, Popconfirm, message, Button } from 'antd';
import { Link } from 'react-router-dom';
import CustomTable from 'components/table/CustomTable';
import VideoTable from './DogHouseCom/Table';
import VideoSearch from './DogHouseCom/Search';
import Immutable from 'immutable';
class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null,
      dataSource: [],
      loading: false,
      pagination: {
        houseId: '',
        name: '',
        currPage: 1,
        pageSize: 10,
        total: 0,
      },
      pageSize: 10,
      currPage: 1,
      selectedRowKeys: [],
    };
  }
  handleLimit = (limit) => {
    let per = Object.assign({}, this.state.pagination, {
      currPage: 1,
      houseId: limit && limit.houseId,
      name: limit && limit.name,
      current: 1,
    });
    this.setState({ pagination: per }, () => {
      this.fetch(this.state.pagination);
    });
  };
  componentDidMount() {
    this.fetch();
  }
  // 多选
  handleSelectChange = (arrs) => {
    this.setState({ selectedRowKeys: arrs });
  };
  // 每页条数
  handleShowSizeChange = (cur, size) => {
    let per = Object.assign({}, this.state.pagination, { currPage: cur, pageSize: size, current: cur });
    this.setState({ pagination: per }, () => {
      this.fetch(this.state.pagination);
    });
  };
  // 页码
  handleChangeSize = (page, size) => {
    //   let per = Object.assign({}, this.state.pagination, { currPage: pages.current, pageSize: pages.pageSize });
    let per = Object.assign({}, this.state.pagination, { currPage: page, current: page });
    this.setState({ pagination: per }, () => {
      this.fetch(this.state.pagination);
    });
  };
  //删除
  deleteDogs = (record, index) => {
    let { pagination } = this.state;
    React.httpAjax('post', config.apiUrl + '/api/dogRoom/deleteByIds', { ids: [record.id] }).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        this.fetch({
          pageSize: pagination.pageSize,
          currPage: 1,
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
      message.warn('请选择要删除的视频');
    } else {
      React.httpAjax('post', config.apiUrl + '/api/dogRoom/deleteByIds', { ids: selectedRowKeys }).then((res) => {
        if (res.code == 0) {
          message.success('删除成功');
          this.setState({ selectedRowKeys: [] }, () => {
            this.fetch({
              pageSize: pagination.pageSize,
              currPage: 1,
            });
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
  fetch(params = this.state.pagination) {
    this.setState({ loading: true });
    React.httpAjax('post', config.apiUrl + '/api/dogRoom/listRoomData', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        this.setState({ dataSource: res.list, loading: false, pagination });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const columns = [
      {
        title: '楼号',
        dataIndex: 'houseName',
        key: 'houseName',
      },
      {
        title: '犬舍',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        render: (text, record, index) => {
          return (
            <div>
              <span
                style={{ cursor: 'pointer', color: '#1890ff' }}
                // onClick={()=>this.viewDetail(record)}
              >
                <Link to={{ pathname: '/app/room/infoDetail', query: { Id: record.id, targetText: '查看' } }}>
                  <span style={{ cursor: 'pointer', color: '#1890ff' }}>
                    <Icon type="eye" style={{ margin: '0 10px' }} />
                    查看
                  </span>
                </Link>
              </span>
              <Link to={{ pathname: '/app/room/infoEdit', query: { Id: record.id, targetText: '编辑' } }}>
                <span style={{ cursor: 'pointer', color: '#1890ff' }}>
                  <Icon type="edit" style={{ margin: '0 10px' }} />
                  编辑
                </span>
              </Link>
              <Popconfirm title="确认删除此犬舍?" onConfirm={() => this.deleteDogs(record)}>
                <span style={{ cursor: 'pointer', color: '#1890ff' }}>
                  <Icon type="delete" style={{ margin: '0 10px' }} />
                  删除
                </span>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <VideoSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <div style={{ marginBottom: '20px' }}>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.addInfo}>
                  <Link to={{ pathname: '/app/room/infoAdd', query: { targetText: '新增' } }}>新增犬舍</Link>
                </Button>
                <Button onClick={this.deleteMore}>批量删除</Button>
              </div>
              <CustomTable
                dataSource={this.state.dataSource}
                pagination={this.state.pagination}
                loading={this.state.loading}
                columns={columns}
                isBordered={true}
                isRowSelects={true}
                rowSelectKeys={this.state.selectedRowKeys}
                handleChangeSize={this.handleChangeSize}
                handleShowSizeChange={this.handleShowSizeChange}
                handleSelectChange={this.handleSelectChange}
              ></CustomTable>
            </Card>
          </Col>
        </Row>
        {/* <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <VideoTable filter={this.state.limit} />
            </Card>
          </Col>
        </Row> */}
      </div>
    );
  }
}
export default Room;

// WEBPACK FOOTER //
// ./src/components/admin/dogHouse/Room.js
