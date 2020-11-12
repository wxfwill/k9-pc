import React, { Component } from 'react';
import { Table, Button, Icon, Popconfirm, message, Modal, Form, Row, Col, Input, Tag } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import Immutable from 'immutable';
import { firstLayout, secondLayout } from 'util/Layout';
import moment from 'moment';
const FormItem = Form.Item;
class HolidayTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      modalLoading: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 10,
      checkDate: this.getCheckDate(),
      currPage: 1,
      visible: false,
      selectedRowKeys: [],
      selectedId: '',
    };
  }

  showModal = (id) => {
    this.setState({
      visible: true,
      selectedId: id,
    });
    this.props.form.resetFields();
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  //取消当月资格
  cancelRank = () => {
    this.props.form.validateFields((error, row) => {
      if (!error) {
        this.setState({ modalLoading: true });
        row.id = this.state.selectedId;
        row.pageSize = this.state.pageSize;
        row.currPage = this.state.currPage;
        React.$ajax.performance
          .cancelRank({ ...row })
          .then((res) => {
            const newData = [...this.state.dataSource];
            const index = newData.findIndex((item) => this.state.selectedId === item.id);
            if (index > -1) {
              const item = newData[index];
              item.valid = 1;
              newData.splice(index, 1, {
                ...item,
                ...row,
              });
              this.setState({ dataSource: newData, visible: false, modalLoading: false });
            } else {
              newData.push(this.state.dataSource);
              this.setState({ dataSource: newData, visible: false, modalLoading: false });
            }
            message.success('取消成功！');
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  };
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
  getCheckDate() {
    let year = moment(new Date()).format('YYYY');
    let month = moment(new Date()).format('M');
    if (month > 9) {
      return year + '-' + month;
    } else {
      return year + '-0' + month;
    }
  }
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage, checkDate: this.state.checkDate }) {
    this.setState({ loading: true });
    React.$ajax.performance
      .listPerformanceCheckRank({
        ...params,
      })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({ dataSource: res.list, loading: false, pagination, ...params });
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
      checkDate: this.state.checkDate,
    });
  };
  onSelectChange = (selectedRowKeys) => {
    //console.log(selectedRowKeys)
    this.setState({ selectedRowKeys });
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
    const { dataSource, loading, pagination, selectedRowKeys, modalLoading, checkDate } = this.state;
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };

    const columns = [
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '职务',
        dataIndex: 'duty',
        key: 'duty',
      },
      {
        title: '绩效总分',
        dataIndex: 'totalScore',
        key: 'totalScore',
      },
      {
        title: '警犬训练',
        dataIndex: 'dogTrainScore',
        key: 'dogTrainScore',
      },
      {
        title: '训练考核',
        dataIndex: 'trainCheckScore',
        key: 'trainCheckScore',
      },
      {
        title: '警犬使用及执勤值班',
        dataIndex: 'dogUseScore',
        key: 'dogUseScore',
      },
      {
        title: '理化管理',
        dataIndex: 'dailyManageScore',
        key: 'dailyManageScore',
      },
      ,
      {
        title: '出勤考勤',
        dataIndex: 'outdoorScore',
        key: 'outdoorScore',
      },
      {
        title: '绩效状态',
        dataIndex: 'valid',
        key: 'valid',
        render: (text, record, index) => {
          return record.valid == 0 ? <Tag color="#2db7f5">有效</Tag> : <Tag color="#f50">无效</Tag>;
        },
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        render: (text, record, index) => {
          return (
            <div>
              {record.valid == 0 && moment(checkDate).format('YYYY-MM') == moment(new Date()).format('YYYY-MM') ? (
                <div>
                  <Link
                    to={{ pathname: '/app/performance/registerEdit', query: { record: record, checkDate: checkDate } }}
                  >
                    <span style={{ cursor: 'pointer', color: '#1890ff' }}>
                      <Icon type="edit" style={{ margin: '0 10px' }} />
                      编辑
                    </span>
                  </Link>

                  <span onClick={() => this.showModal(record.id)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                    <Icon type="close-circle-o" style={{ margin: '0 10px' }} />
                    取消当月资格
                  </span>
                </div>
              ) : (
                <div>
                  <Link
                    to={{
                      pathname: '/app/performance/registerDetail',
                      query: { record: record, checkDate: checkDate },
                    }}
                  >
                    <span style={{ cursor: 'pointer', color: '#1890ff' }}>
                      <Icon type="eye" style={{ margin: '0 10px' }} />
                      查看
                    </span>
                  </Link>
                </div>
              )}
            </div>
          );
        },
      },
    ];
    return (
      <div>
        {/* <div style={{marginBottom:'20px'}}>
          <Button type='primary' style={{marginRight:'20px'}} onClick={this.addInfo}>
            <Link to={{pathname:'/app/holiday/holidayListAdd', query: {targetText:'新增' }}}>新增</Link>
          </Button>
         <Button style={{margin:'0 20px'}}>导出</Button>
        </div>*/}

        <Table
          dataSource={this.state.dataSource}
          columns={columns}
          loading={loading}
          onChange={this.handleTableChange}
          pagination={pagination}
          bordered
          rowKey={(row) => {
            return 'key-' + row.userId;
          }}
          //       rowSelection={rowSelection}
        />
        <Form className="ant-advanced-search-form">
          <Modal
            title="绩效信息"
            visible={this.state.visible}
            onOk={this.cancelRank}
            onCancel={this.hideModal}
            loading={modalLoading}
            okText="确认"
            cancelText="取消"
          >
            <Row gutter={24}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <FormItem label="原因：" {...firstLayout}>
                  {getFieldDecorator('cancelReason', {
                    rules: [
                      { required: true, message: '请输入原因' },
                      { max: 300, message: '原因不超过300' },
                    ],
                    initialValue: '',
                  })(<Input.TextArea placeholder="" autosize={{ minRows: 2, maxRows: 24 }} />)}
                </FormItem>
              </Col>
            </Row>
          </Modal>
        </Form>
      </div>
    );
  }
}
export default Form.create()(HolidayTable);

// WEBPACK FOOTER //
// ./src/components/admin/performance/Register/Table.js
