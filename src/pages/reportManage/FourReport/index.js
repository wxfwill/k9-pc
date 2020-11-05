import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Input,
  Form,
  DatePicker,
  Radio,
  InputNumber,
  Select,
  TreeSelect,
  Popconfirm,
  message,
} from 'antd';
import Moment from 'moment';

import 'style/pages/reportManage/FourReport/index.less';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

//查询人员列表
let personnelList = [];
(function () {
  React.httpAjax('post', config.apiUrl + '/api/userCenter/getCombatStaff')
    .then((res) => {
      if (res.code == 0) {
        personnelList = res.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
})();
//查询中队及用户信息。key：中队名称；value：中队下符合条件人员；
let personnelTree = [];
let isSearch = true;
function queryGroupUser(keyword) {
  if (!isSearch) {
    return;
  }
  isSearch = false;
  let dataObj = {
    keyword: keyword,
  };
  React.httpAjax('post', config.apiUrl + '/api/userCenter/queryGroupUser', dataObj)
    .then((res) => {
      if (res.code == 0) {
        let arr = [];
        for (const name in res.data) {
          arr.push({
            name: name,
            children: res.data[name],
          });
        }
        personnelTree = arr;
      }
      isSearch = true;
    })
    .catch((error) => {
      console.log(error);
      isSearch = true;
    });
}
queryGroupUser();
//根据大类名查询该类下的规则
let ruleList = [];
(function () {
  let dataObj = {
    rootName: '4W报备',
  };
  React.httpAjax('get', config.apiUrl + '/api/integral-rule/queryRulesByRootName', {
    params: dataObj,
  })
    .then((res) => {
      if (res.code == 0) {
        ruleList = res.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
})();
//地点列表
let areaList = [];
(function () {
  React.httpAjax('post', config.apiUrl + '/api/basicData/subordinateAreaList')
    .then((res) => {
      if (res.code == 0) {
        areaList = res.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
})();

class EditableCell extends React.Component {
  state = {
    editing: false,
    searchPeers: '',
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e) => {
    console.log(e);
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = (form) => {
    this.form = form;
    const { dataIndex, record, title } = this.props;
    let domHtml = '';
    switch (title) {
      case '时间':
        domHtml = (
          <DatePicker ref={(node) => (this.input = node)} showTime placeholder="请选择时间" onChange={this.save} />
        );
        break;
      // case '来源':
      //   domHtml = (
      //     <Radio.Group ref={(node) => (this.input = node)} onChange={this.save}>
      //       <Radio value="wg">警犬大队工作群</Radio>
      //       <Radio value="f2f">面对面口述</Radio>
      //     </Radio.Group>
      //   );
      //   break;
      case '类别':
        domHtml = (
          <TreeSelect
            ref={(node) => (this.input = node)}
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择类别"
            allowClear
            multiple
            treeDefaultExpandAll
            treeNodeFilterProp="title"
            onChange={this.save}
          >
            {ruleList && ruleList.length > 0
              ? ruleList.map((item) => {
                  return (
                    <TreeNode value={item.id} title={item.ruleName} key={item.id} selectable={false}>
                      {item.children && item.children.length > 0
                        ? item.children.map((el) => {
                            return <TreeNode value={el.id} title={el.ruleName} key={el.id} />;
                          })
                        : null}
                    </TreeNode>
                  );
                })
              : null}
          </TreeSelect>
        );
        break;
      case '任务指派领导':
        domHtml = (
          <Select
            ref={(node) => (this.input = node)}
            mode="multiple"
            optionFilterProp="children"
            style={{ width: '100%' }}
            placeholder="请输入任务指派领导"
            onChange={this.save}
          >
            {personnelList && personnelList.length > 0
              ? personnelList.map((item) => {
                  return <Option key={item.id}>{item.name}</Option>;
                })
              : null}
          </Select>
        );
        break;
      case '任务执行人':
        domHtml = (
          <TreeSelect
            ref={(node) => (this.input = node)}
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择任务执行人"
            allowClear
            multiple
            filterTreeNode={() => true}
            onSearch={(value) => {
              queryGroupUser(value);
            }}
            onChange={this.save}
          >
            {personnelTree && personnelTree.length > 0
              ? personnelTree.map((item) => {
                  return (
                    <TreeNode value={item.name} title={item.name} key={item.name} selectable={false}>
                      {item.children && item.children.length > 0
                        ? item.children.map((el) => {
                            return <TreeNode value={el.id} title={el.name} key={el.id} />;
                          })
                        : null}
                    </TreeNode>
                  );
                })
              : null}
          </TreeSelect>
        );
        break;
      case '用车审核人':
        domHtml = (
          <Select
            ref={(node) => (this.input = node)}
            mode="multiple"
            optionFilterProp="children"
            style={{ width: '100%' }}
            placeholder="请输入用车审核人"
            onChange={this.save}
          >
            {personnelList && personnelList.length > 0
              ? personnelList.map((item) => {
                  return <Option key={item.id}>{item.name}</Option>;
                })
              : null}
          </Select>
        );
        break;
      case '详细情况':
        domHtml = (
          <TextArea ref={(node) => (this.input = node)} rows={2} placeholder="请输入详细情况" onBlur={this.save} />
        );
        break;
      case '是否反馈':
        domHtml = (
          <Radio.Group ref={(node) => (this.input = node)} onChange={this.save}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        );
        break;
      case '反馈内容':
        domHtml = (
          <TextArea ref={(node) => (this.input = node)} rows={2} placeholder="请输入反馈内容" onBlur={this.save} />
        );
        break;
      case '抓捕人数':
        domHtml = <InputNumber ref={(node) => (this.input = node)} min={0} max={1000} onChange={this.save} />;
        break;
      case '任务地点':
        domHtml = (
          <Select
            ref={(node) => (this.input = node)}
            showSearch
            style={{ width: '100%' }}
            placeholder="请选择任务地点"
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={this.save}
          >
            {areaList && areaList.length > 0
              ? areaList.map((item) => {
                  return (
                    <Option value={item.name} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })
              : null}
          </Select>
        );
        break;
      case '备注':
        domHtml = <TextArea ref={(node) => (this.input = node)} rows={2} placeholder="请输入备注" onBlur={this.save} />;
        break;
    }
    //return domHtml;
    return (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title}不能为空！`,
            },
          ],
          initialValue: record[dataIndex],
        })(domHtml)}
      </Form.Item>
    );
  };

  render() {
    const { editable, dataIndex, title, record, index, handleSave, children, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children}
      </td>
    );
  }
}

class FourReport extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'key',
        width: '70px',
        fixed: 'left',
      },
      {
        title: '时间',
        dataIndex: 'repTime',
        width: '220px',
        editable: true,
      },
      {
        title: '任务指派领导',
        dataIndex: 'taskAssignLeader',
        width: '150px',
        editable: true,
      },
      // {
      //   title: '来源',
      //   dataIndex: 'source',
      //   width: '150px',
      //   editable: true,
      // },
      {
        title: '类别',
        dataIndex: 'categoryIds',
        width: '140px',
        editable: true,
      },
      {
        title: '用车审核人',
        dataIndex: 'carUseAuditor',
        width: '150px',
        editable: true,
      },
      {
        title: '任务执行人',
        dataIndex: 'taskExecutor',
        width: '150px',
        editable: true,
      },
      // {
      //   title: '汇报人',
      //   dataIndex: 'reporters',
      //   width: '150px',
      //   editable: true,
      // },
      // {
      //   title: '同行人',
      //   dataIndex: 'peers',
      //   width: '140px',
      //   editable: true,
      // },
      // {
      //   title: '记录人',
      //   dataIndex: 'loggers',
      //   width: '140px',
      //   editable: true,
      // },
      {
        title: '详细情况',
        dataIndex: 'repDetail',
        width: '160px',
        editable: true,
      },
      {
        title: '是否反馈',
        dataIndex: 'isFeedback',
        width: '90px',
        editable: true,
      },
      {
        title: '反馈内容',
        dataIndex: 'feedbackContext',
        width: '160px',
        editable: true,
      },
      {
        title: '抓捕人数',
        dataIndex: 'arrestNum',
        width: '110px',
        editable: true,
      },
      {
        title: '任务地点',
        dataIndex: 'taskLocation',
        width: '140px',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: '140px',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operationKey',
        width: '80px',
        fixed: 'right',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [],
      count: 1,
    };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      operationKey: this.state.count,
      arrestNum: 0,
      categoryIds: [], //类别
      feedbackContext: '',
      //id: 0,
      isFeedback: 0,
      //loggers: [], //记录人
      //peers: [], //同行人
      remark: '',
      repDetail: '',
      repTime: null,
      //reporters: [], //汇报人
      source: '',
      taskLocation: '',
      taskAssignLeader: [], //任务指派领导
      carUseAuditor: [], //用车审核人
      taskExecutor: [], //任务执行人
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '4w上报'] });
  }
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  //提交报备信息
  onSubmit = () => {
    const { dataSource } = this.state;
    if (dataSource && dataSource.length > 0) {
      let arr = [];
      dataSource.map((item) => {
        arr.push({
          categoryIds: item.categoryIds, //类别
          feedbackContext: item.feedbackContext,
          //id: 0,
          isFeedback: item.isFeedback,
          loggers: item.loggers, //记录人
          peers: item.peers, //同行人
          remark: item.remark,
          repDetail: item.repDetail,
          repTime: Moment(item.repTime),
          reporters: item.reporters, //汇报人
          source: item.source,
          taskLocation: item.taskLocation,
        });
      });
      const dataObj = {
        reports: arr,
      };
      React.httpAjax('post', config.apiUrl + '/api/report/create4wReport', dataObj)
        .then((res) => {
          if (res.code == 0) {
            message.success('上报成功！');
            this.props.history.push('/app/reportManage/FourReportListSearch');
          } else {
            message.error(res.msg);
          }
        })
        .catch((error) => {
          message.error(error.msg);
        });
    } else {
      message.error('请新增上报内容！');
    }
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <Row className="FourReport">
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false}>
            <Button
              //onClick={this.addReport}
              onClick={this.handleAdd}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              增加行
            </Button>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={columns}
              scroll={{ x: 1750 }}
              pagination={false}
            />
            {dataSource && dataSource.length > 0 ? (
              <Button
                onClick={this.onSubmit}
                type="primary"
                style={{
                  marginTop: 30,
                }}
              >
                提交
              </Button>
            ) : null}
          </Card>
        </Col>
      </Row>
    );
  }
}

export default FourReport;
