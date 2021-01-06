import React, {Component} from 'react';
import {Form, Table, Button, Icon, Popconfirm, message, Modal, Row, Col, Input} from 'antd';
import {Link} from 'react-router-dom';
import Immutable from 'immutable';
import moment from 'moment';
import httpAjax from 'libs/httpAjax';
import {firstLayout} from 'util/Layout';

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
      visible: false,
      pageSize: 10,
      currPage: 1,
      selectedRowKeys: []
    };
  }
  componentWillMount() {
    this.fetch();
  }
  fetch = (params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) => {
    React.$ajax.postData('/api/leaveRecord/leaveListPage', {...params}).then((res) => {
      const pagination = {...this.state.pagination};
      pagination.total = res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      this.setState({dataSource: res.list, loading: false, pagination});
    });
  };
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.filter);
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    const filter = nextProps.filter;
    const _this = this;
    this.setState({filter: filter, pageSize: 10, currPage: 1}, function () {
      this.fetch({pageSize: 10, currPage: 1, ...filter});
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
  showModal = (text, record, index) => {
    console.log(text, record, index);
    this.setState({visible: true});
    this.handleOk = () => {
      this.setState({visible: false}, () => this.erifyLeaveApply(record, 1));
    };
    this.handleCancel = () => {
      this.setState({visible: false}, () => this.erifyLeaveApply(record, 2));
    };
  };
  // /api/leaveRecord  / v erifyLeaveApply
  erifyLeaveApply = (record, verify) => {
    this.props.form.validateFields((err, values) => {
      httpAjax('post', config.apiUrl + '/api/leaveRecord/verifyLeaveApply', {
        opinion: values.opinion,
        verify,
        id: record.id
      }).then((res) => {
        if (res.code == 0) {
          message.success('审批成功！');
          this.fetch();
        }
      });
    });
  };
  // handleOk = () => {
  //   this.setState({visible: false})
  // }
  // handleCancel = () => {
  //   this.setState({visible: false})
  // }
  render() {
    const {dataSource, loading, pagination, selectedRowKeys} = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys
    };
    const columns = [
      {
        title: '申请人',
        dataIndex: 'name'
      },
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '请假类型',
        dataIndex: 'typeStr'
      },
      {
        title: '开始时间',
        dataIndex: 'leaveStartTime',
        render: (record) => moment(record).format('YYYY-MM-DD')
      },
      {
        title: '结束时间',
        dataIndex: 'leaveEndTime',
        render: (record) => moment(record).format('YYYY-MM-DD')
      },
      {
        title: '请假时长(天)',
        dataIndex: 'duration'
      },
      {
        title: '请假事由',
        dataIndex: 'remark'
      },
      {
        title: '中队审批',
        dataIndex: 'headerApproveState',
        render: (record) => (record == 0 ? '待审批' : record == 1 ? '审批通过' : '审批不通过')
      },
      {
        title: '大队审批',
        dataIndex: 'leaderApproveState',
        render: (record) => (record == 0 ? '待审批' : record == 1 ? '审批通过' : '审批不通过')
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        render: (text, record, index) => {
          // console.log(text, record, index)
          return (
            <Button type="primary" disabled={record.record != 2} onClick={() => this.showModal(text, record, index)}>
              审批
            </Button>
          );
        }
      }
    ];
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
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
        <Modal
          title="请假审批"
          visible={this.state.visible}
          cancelText="审批不通过"
          okText="审批通过"
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item label="审批意见" {...firstLayout}>
                {getFieldDecorator('opinion')(<Input.TextArea placeholder="审批意见" />)}
              </Form.Item>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(DogTable);
