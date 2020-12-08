import React, { Component } from 'react';
import { Table, Modal, Button, Carousel } from 'antd';
//import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import moment from 'moment';
//import CallDetail from './CallDetail';
//const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');
class CallTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 10,
      currPage: 1,
      data: [],
      visible: false,
      photoNames: [],
      filter: null,
      loading: false,
      /*   queryId:'',
      changeLeft:false,
      showDetail:false,
      statisticsTime:''*/
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
    let isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      let _this = this;
      this.setState({ filter }, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter,
        });
      });
    }
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
      ...this.state.filter,
    });
  };
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    this.setState({ loading: true });
    React.$ajax.postData('/api/attendance/listPage', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.totalCount;
        pagination.current = res.data.currPage;
        pagination.pageSize = res.data.pageSize;
        this.setState({ data: res.data.list, loading: false, pagination });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  /* queryDetail=(data,statisticsTime)=>{
    this.setState({
      queryId:data,
      showDetail:true,
      changeLeft:true,
      statisticsTime
    })
  }
  handleShow(){
    let _this = this;
    this.setState({
      changeLeft:false
    },function(){
      setTimeout(()=>{
        _this.setState({
          showDetail:false
        })
      },600)
    })
  }*/
  getColumns() {
    let _this = this;
    const columns = [
      {
        title: '提交人',
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '提交时间',
        dataIndex: 'opTime',
        key: 'opTime',
        render: (opTime, record, index) => {
          return <span>{opTime ? moment(opTime).format('YYYY-MM-DD h:mm:ss') : '--'}</span>;
        },
      },
      {
        title: '描述',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '图片',
        dataIndex: 'photoNames',
        key: 'photoNames',
        render: (photoNames, record, index) => {
          return (
            <img
              onClick={_this.showPhoto.bind(this, photoNames)}
              key={index}
              src={`${config.apiUrl}/api/attendance/img?fileName=${photoNames[0]}`}
              style={{ height: '30px', width: '30px', marginRight: '8px' }}
            />
          );
        },
      },
    ];
    return columns;
  }
  showPhoto = (photoNames) => {
    console.log(photoNames, 'photoNames');
    console.log(photoNames && photoNames.length > 0, 'photoNamesss');
    this.setState({
      photoNames,
    });
    this.showModal();
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { match } = this.props;
    let { photoNames, visible } = this.state;
    return (
      <div>
        <Table
          rowKey={(row) => {
            return 'key-' + row.id;
          }}
          loading={this.state.loading}
          columns={this.getColumns()}
          dataSource={this.state.data}
          bordered
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
        {/*this.state.showDetail?<CallDetail handleShow={this.handleShow.bind(this)} queryId={this.state.queryId} statisticsTime={this.state.statisticsTime}changeLeft={this.state.changeLeft}/>:null*/}
        <Modal
          title="图片详情"
          visible={visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          footer={[
            <Button key="submit" type="primary" onClick={this.hideModal}>
              确定
            </Button>,
          ]}
        >
          <Carousel autoplay>
            {photoNames && photoNames.length > 0 ? (
              photoNames.map((file, index) => (
                <div>
                  <img key={index} src={`${config.apiUrl}/api/attendance/img?fileName=${file}`} />
                </div>
              ))
            ) : (
              <div>{'暂无就图片信息'}</div>
            )}
          </Carousel>
        </Modal>
      </div>
    );
  }
}
export default CallTable;

// WEBPACK FOOTER //
// ./src/components/admin/holiday/Call/CallTable.js
