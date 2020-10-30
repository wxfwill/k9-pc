import React, { Component } from 'react';
import { Row, Col, Card, Table, Input, Button, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
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
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={(node) => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
        {children}
      </div>
    );
  };

  render() {
    const { editable, dataIndex, title, record, index, handleSave, children, ...restProps } = this.props;
    console.log(title, '========================');
    return (
      <td {...restProps}>
        {editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children}

        {/* {title == '时间' ? <EditableContext.Consumer>{() => <div>时间栏位</div>}</EditableContext.Consumer> : null}
        {title == '来源' ? <EditableContext.Consumer>{() => <div>来源栏位</div>}</EditableContext.Consumer> : null} */}
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
        width: '80px',
        fixed: 'left',
      },
      {
        title: '时间',
        dataIndex: 'repTime',
        width: '230px',
        editable: true,
      },
      {
        title: '来源',
        dataIndex: 'source',
        editable: true,
      },
      {
        title: '类别',
        dataIndex: 'categoryIds',
        editable: true,
      },
      {
        title: '汇报人',
        dataIndex: 'reporters',
        width: '230px',
        editable: true,
      },
      {
        title: '同行人',
        dataIndex: 'peers',
        width: '230px',
        editable: true,
      },
      {
        title: '记录人',
        dataIndex: 'loggers',
        width: '230px',
        editable: true,
      },
      {
        title: '详细情况',
        dataIndex: 'repDetail',
        width: '230px',
        editable: true,
      },
      {
        title: '是否反馈',
        dataIndex: 'isFeedback',
        width: '150px',
        editable: true,
      },
      {
        title: '反馈内容',
        dataIndex: 'feedbackContext',
        width: '230px',
        editable: true,
      },
      {
        title: '抓捕人数',
        dataIndex: 'arrestNum',
        width: '120px',
        editable: true,
      },
      {
        title: '任务地点',
        dataIndex: 'taskLocation',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: '230px',
        fixed: 'right',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
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
      arrestNum: 0,
      categoryIds: [],
      feedbackContext: '',
      //id: 0,
      isFeedback: 0,
      loggers: [],
      peers: [],
      remark: '',
      repDetail: '',
      repTime: '111',
      reporters: [],
      source: '3333',
      taskLocation: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

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
    let dataObj = {
      reports: this.state.dataSource,
    };
    React.httpAjax('post', config.apiUrl + '/api/report/create4wReport', dataObj)
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
      <Row>
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
            {/* <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button> */}
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={columns}
              scroll={{ x: 2670 }}
              pagination={false}
            />
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
