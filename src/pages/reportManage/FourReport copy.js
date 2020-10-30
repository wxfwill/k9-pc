import React, { Component } from 'react';
import { Row, Col, Card, Button, Table, Input, Form, DatePicker, Radio, InputNumber, Select, TreeSelect } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

function onOk(value) {
  console.log('onOk: ', value);
}

class FourReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          width: '80px',
          fixed: 'left',
        },
        {
          title: '时间',
          dataIndex: 'repTime',
          width: '230px',
          render: (time) => <DatePicker showTime placeholder="请选择时间" onChange={onChange} onOk={onOk} />,
        },
        {
          title: '来源',
          dataIndex: 'source',
          render: (source) => (
            <Radio.Group onChange={this.selectSource} value={source}>
              <Radio value="wg">警犬大队工作群</Radio>
              <Radio value="f2f">面对面口述</Radio>
            </Radio.Group>
          ),
        },
        {
          title: '类别',
          dataIndex: 'categoryIds',
          render: () => (
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              //value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择类别"
              allowClear
              treeDefaultExpandAll
              //onChange={this.onChange}
            >
              <TreeNode value="parent 1" title="parent 1" key="0-1">
                <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                  <TreeNode value="leaf1" title="my leaf" key="random" />
                  <TreeNode value="leaf2" title="your leaf" key="random1" />
                </TreeNode>
                <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                  <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
                </TreeNode>
              </TreeNode>
            </TreeSelect>
          ),
        },
        {
          title: '汇报人',
          dataIndex: 'reporters',
          width: '230px',
          render: () => <Input placeholder="请输入或粘贴汇报人" />,
        },
        {
          title: '同行人',
          dataIndex: 'peers',
          width: '230px',
          render: () => (
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              //value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择同行人"
              allowClear
              multiple
              treeDefaultExpandAll
              //onChange={this.onChange}
            >
              <TreeNode value="parent 1" title="parent 1" key="0-1">
                <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                  <TreeNode value="leaf1" title="my leaf" key="random" />
                  <TreeNode value="leaf2" title="your leaf" key="random1" />
                </TreeNode>
                <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                  <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
                </TreeNode>
              </TreeNode>
            </TreeSelect>
          ),
        },
        {
          title: '记录人',
          dataIndex: 'loggers',
          width: '230px',
          render: () => <Input placeholder="请输入或粘贴记录人" />,
        },
        {
          title: '详细情况',
          dataIndex: 'repDetail',
          width: '230px',
          render: () => <TextArea rows={2} placeholder="请输入或粘贴详细情况" />,
        },
        {
          title: '是否反馈',
          dataIndex: 'isFeedback',
          width: '150px',
          render: () => (
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          ),
        },
        {
          title: '反馈内容',
          dataIndex: 'feedbackContext',
          width: '230px',
          render: () => <TextArea rows={2} placeholder="请输入或粘贴反馈内容" />,
        },
        {
          title: '抓捕人数',
          dataIndex: 'arrestNum',
          width: '120px',
          render: () => <InputNumber min={1} max={10} defaultValue={3} />,
        },
        {
          title: '任务地点',
          dataIndex: 'taskLocation',
          render: () => (
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择任务地点"
              optionFilterProp="children"
              // onChange={onChange}
              // onFocus={onFocus}
              // onBlur={onBlur}
              // onSearch={onSearch}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
          ),
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '230px',
          fixed: 'right',
          render: () => <TextArea rows={2} placeholder="请输入或粘贴备注" />,
        },
      ],
      dataSource: [],
      count: 0,
    };
  }
  selectSource = (e) => {
    console.log(e);
  };
  //新增
  addReport = () => {
    let arr = this.state.dataSource;
    this.setState(
      {
        count: this.state.count + 1,
      },
      () => {
        arr.push({
          key: this.state.count,
          arrestNum: 0,
          categoryIds: [],
          feedbackContext: '',
          //id: 0,
          isFeedback: 0,
          loggers: [],
          peers: [],
          remark: '',
          repDetail: '',
          repTime: '',
          reporters: [],
          source: '',
          taskLocation: '',
        });
        this.setState({
          dataSource: arr,
        });
      }
    );
  };
  //提交报备信息
  onSubmit = () => {
    let dataObj = {
      reports: this.state.dataSource,
    };
    httpAjax('post', config.apiUrl + '/api/report/create4wReport', dataObj)
      .then((res) => {
        console.log(res, '提交返回信息-------------');
        // if (res.code == 0) {
        //   this.props.history.push('/app/report/4wcommand');
        //   message.success(successMess);
        // } else {
        //   message.error(errorMess);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    const { columns, dataSource } = this.state;
    return (
      <Row>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false}>
            <Button
              onClick={this.addReport}
              type="primary"
              style={{
                marginBottom: 10,
              }}
            >
              增加行
            </Button>
            <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: 2670 }} pagination={false} />
            <Button
              onClick={this.onSubmit}
              type="primary"
              style={{
                marginTop: 30,
              }}
            >
              提交
            </Button>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default FourReport;
