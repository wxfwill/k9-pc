import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Radio,
  DatePicker,
  Button,
  Select,
  Upload,
  message,
  Table,
  Tag,
} from 'antd';
import { firstLayout, secondLayout } from 'util/Layout';
import moment from 'moment';
import httpAjax from 'libs/httpAjax';

class ExecutePlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dogsData: [],
      selectedRowKeys: [],
    };
  }
  getDogs = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        httpAjax('post', config.apiUrl + '/api/dog/queryByCreateTime', {
          startTime: values.startTime.format('x'),
          endTime: values.endTime.format('x'),
        }).then((res) => {
          if (res.code == 0) {
            this.setState({ dogsData: res.data });
          } else {
            message.error('查询犬只失败！');
          }
        });
      }
    });
  };
  submint = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      // const dogIds = selectedRowKeys.map((item) => {
      //     return item.id;
      // })
      let excuteDate = '';
      this.props.form.validateFields((err, values) => {
        excuteDate = values.excuteDate.format('x');
      });
      debugger;
      httpAjax('post', config.apiUrl + '/api/vaccineRecord/excPlan', {
        dogIds: selectedRowKeys.join(','),
        excuteDate: excuteDate,
        id: this.props.location.query && this.props.location.query.record.id,
      }).then((res) => {
        if (res.code == 0) {
          message.info('提交成功！');
          this.props.history.push('/app/dog/prevention');
        } else {
          message.error('提交失败，稍后再试！');
        }
      });
    } else {
      message.error('请选择犬只！');
    }
  };
  onSelectChange = (selectedRowKeys) => {
    //console.log(selectedRowKeys)
    this.setState({ selectedRowKeys });
  };
  handleTableChange = (a, b, c) => {
    console.log(a, b, c);
  };

  render() {
    console.log(this.state);
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state;
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
        title: '名称',
        dataIndex: 'name',
      },
    ];
    const record = this.props.location.query && this.props.location.query.record;
    if (!record) {
      this.props.history.push('/app/dog/prevention');
    }
    return (
      <div className="ExecutePlan">
        <Row gutter={30}>
          <Col span={30}>
            <Card title="犬病防治" bordered={true}>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form">
                  <Row gutter={30}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <Form.Item label="计划名称" {...secondLayout}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请填写计划名称' }],
                          initialValue: record.name,
                        })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <Form.Item label="注射时间" {...secondLayout}>
                        {getFieldDecorator('excuteDate', {
                          rules: [{ required: true, message: '请选择计划时间' }],
                          initialValue: moment(),
                        })(<DatePicker format="YYYY-MM-DD" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <Form.Item label="计划时间" {...secondLayout}>
                        {getFieldDecorator('name', {
                          initialValue: moment(record.planDate).format('YYYY-MM-DD'),
                        })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <Form.Item label="药物名称" {...secondLayout}>
                        {getFieldDecorator('vaccineTypeNames', {
                          initialValue: record.vaccineTypeNames,
                        })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={24} md={12} sm={24} xs={24} style={{ width: '100%' }}>
                      <Form.Item label="选择犬只" {...secondLayout}>
                        {getFieldDecorator('startTime', {
                          rules: [{ required: true, message: '请选择计划时间' }],
                          // initialValue:isInitialValue?moment(new Date(planDate)) :""
                        })(
                          <DatePicker
                            format="YYYY-MM-DD"
                            // disabled={disabled} disabledDate={this.disabledDate}
                            placeholder="选择开始时间"
                            style={{ display: 'inline-block', marginRight: 20 }}
                          />
                        )}
                        <span>至</span>
                        {getFieldDecorator('endTime', {
                          rules: [{ required: true, message: '请选择计划时间' }],
                          // initialValue:isInitialValue?moment(new Date(planDate)) :""
                        })(
                          <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="选择结束时间"
                            style={{ display: 'inline-block', marginLeft: 20 }}

                            // disabled={disabled} disabledDate={this.disabledDate}
                          />
                        )}
                        <Button style={{ margin: '0 25px' }} type="primary" onClick={this.getDogs}>
                          查询犬只
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row></Row>
                  <Table
                    dataSource={this.state.dogsData}
                    columns={columns}
                    onChange={this.handleTableChange}
                    pagination={false}
                    bordered
                    rowKey="id"
                    rowSelection={rowSelection}
                  />
                  <Row>
                    <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                      <Button type="primary" htmlType="submit" onClick={this.submint}>
                        提交
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                        清空
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(ExecutePlan);

// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogPrevention/ExecutePlan.js
