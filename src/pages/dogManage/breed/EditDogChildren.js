import React, { Component } from 'react';
import {
  Table,
  Button,
  Icon,
  Popconfirm,
  message,
  Tag,
  Card,
  Collapse,
  Row,
  Col,
  Select,
  DatePicker,
  Form,
  Input,
  Tooltip,
} from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import { firstLayout, secondLayout } from 'util/Layout';
import moment from 'moment';

import 'style/app/dogManage/editChildren.less';
class EditDogChildren extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      pupInfos: [],
      edit: false,
      editDate: '',
      canSubmit: true,
      stdWeight: '',
    };
    this.changeEvent = '';
    this.stdWeight = '';
  }
  componentDidMount() {
    this.getDogChildren();
  }
  getDogChildren = () => {
    const id = this.props.match.params.id;
    React.$ajax.postData('/api/breed/reproduceDetail', { id }).then((res) => {
      if (res.code == 0) {
        const { pupInfos, details, diffs } = res.data;
        const pupInfosIds = pupInfos.map((t) => t.id);
        const dataSource = details.map((item) => {
          let average = 0;
          const ArrItem = {
            key: item.opDate,
            date: item.opDate,
            stdWeight: item.stdWeight,
            event: item.event,
            days: item.days,
          };
          item.pupWeightList.forEach((pupItem) => {
            average += pupItem.weight;
            if (pupInfosIds.indexOf(pupItem.pupId) >= 0) {
              ArrItem[pupItem.pupId] = pupItem.weight;
            }
          });
          ArrItem.average = (average / item.pupWeightList.length).toFixed(2);
          return ArrItem;
        });
        const item = { average: '', diffs: true, date: 'ACKS', days: '', event: '', key: '', stdWeight: '' };

        const newDiffs =
          diffs &&
          diffs.map((t, i) => {
            item.avgAddWeight = t.avgAddWeight;
            item.key = 'diffs' + i;
            t.pupWeightList.forEach((j) => {
              item[j.pupId] = j.weight;
            });
            return { ...item };
          });
        const newDataSource = [];
        const allLength = dataSource.length + newDiffs.length;
        let i = 0,
          z = 0;
        for (let x = 0; x < allLength; x++) {
          if (x % 2) {
            newDataSource[x] = newDiffs[z];
            z++;
          } else {
            newDataSource[x] = dataSource[i];
            i++;
          }
        }
        this.setState({ ...res.data, dataSource: newDataSource });
      }
    });
  };
  updatePupName = (item) => {
    this.props.form.validateFields((err, values) => {
      httpAjax('post', config.apiUrl + '/api/breed/updatePupName', {
        pupId: item.id,
        pupName: values[item.id + 'name'],
      }).then((res) => {
        if (res.code == 0) {
          message.info('修改成功！');
        } else {
          message.error('修改失败！');
        }
      });
    });
  };

  saveMeasureRecord = (item) => {
    const { details, pupInfos } = this.state;
    let pupWeightList;

    details.forEach((t, i) => {
      if (t.opDate == item.date) {
        pupWeightList = t.pupWeightList;
      }
    });

    this.props.form.validateFields((err, values) => {
      let newWeightList,
        successMsg = '',
        errorMsg = '';
      if (pupWeightList) {
        successMsg = '修改成功！';
        newWeightList = pupWeightList.map((t, i) => {
          return {
            event: this.changeEvent ? this.changeEvent : t.event,
            weight: this[t.pupId + 'weight'] ? this[t.pupId + 'weight'] : t.weight,
            stdWeight: this.stdWeight ? this.stdWeight : t.stdWeight,
            opDate: values.opDate.format('x'),
            pupId: t.pupId,
            id: t.id,
          };
        });
      } else {
        successMsg = '添加成功！';
        if (!values.opDate) {
          return message.error('请选择日期!');
        }
        const rId = this.props.match.params.id;

        newWeightList = pupInfos.map((t, i) => {
          return {
            event: this.changeEvent || '',
            weight: this[t.id + 'weight'] || '',
            stdWeight: this.stdWeight || '',
            opDate: values.opDate.format('x'),
            pupId: t.id,
            rId,
          };
        });
      }
      httpAjax('post', config.apiUrl + '/api/breed/saveMeasureRecord', { list: newWeightList })
        .then((res) => {
          if (res.code == 0) {
            message.success(successMsg);
            this.setState({ edit: false, editDate: '' }, this.getDogChildren());
          } else {
            message.error('修改失败！');
          }
        })
        .catch((err) => {
          message.error(err.msg);
        });
    });
  };
  setRowClassName = (record, index) => {
    // if(index == 0) {
    //     return 'edit_header'
    // } else {
    return index % 2 ? 'edit_tr' : 'edit_calculate';
    //}
  };
  clickEdit = (item) => {
    console.log(item);
    this.setState({ edit: true, editDate: item.date });
    this.changeEvent = item.event;
    this.stdWeight = item.stdWeight;
    for (let key in item) {
      if (Number(key)) {
        this[key + 'weight'] = item[key];
      }
    }
  };
  addRow = () => {
    const { dataSource, pupInfos } = this.state;
    const item = { average: '', date: '', days: '', event: '', key: '', stdWeight: '' };
    pupInfos.forEach((t) => {
      item[t.id] = '';
    });
    dataSource.push(item);
    this.setState({ dataSource });
  };
  renderOperation = (record, index) => {
    const { edit, editDate } = this.state;
    if (index.diffs) {
      return '';
    } else {
      return edit && editDate == index.date ? (
        <Button
          type="primary"
          onClick={() => {
            this.saveMeasureRecord(index);
          }}
        >
          保存
        </Button>
      ) : (
        <Button type="primary" onClick={() => this.clickEdit(index)}>
          编辑
        </Button>
      );
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { pupInfos, details, dataSource, edit, editDate } = this.state;
    console.log(this.state);

    const addColumns = pupInfos.map((item) => {
      return {
        title: getFieldDecorator(item.id + 'name', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: item ? item.name : '',
        })(<Input onBlur={() => this.updatePupName(item)} />),
        dataIndex: item.id,
        key: item.id,
        render: (record, index) =>
          edit && editDate == index.date ? (
            <Input
              defaultValue={this[item.id + 'weight']}
              onChange={(e) => {
                this[item.id + 'weight'] = e.target.value;
              }}
            />
          ) : (
            record
          ),
      };
    });

    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date', // (record, index) => moment(record).format('YYYY-MM-DD')
        render: (record, index) =>
          edit && editDate == index.date
            ? getFieldDecorator('opDate', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: record && record != 'ACKS' ? moment(record) : '',
              })(<DatePicker />)
            : record && record != 'ACKS'
            ? moment(record).format('YYYY-MM-DD')
            : '',
      },
      ...addColumns,
      {
        title: '平均增重(kg)',
        dataIndex: 'avgAddWeight',
        key: Math.random(),
      },
      {
        title: '平均体重(kg)',
        dataIndex: 'average',
        key: Math.random(),
      },
      {
        title: '标准体重(kg)',
        dataIndex: 'stdWeight',
        key: Math.random(),
        render: (record, index) =>
          edit && editDate == index.date ? (
            <Input defaultValue={this.stdWeight} onChange={(e) => (this.stdWeight = e.target.value)} />
          ) : (
            record
          ),
      },
      {
        title: '日龄',
        dataIndex: 'days',
        key: Math.random(),
      },
      {
        title: '事件',
        dataIndex: 'event',
        key: Math.random(),
        render: (record, index) =>
          edit && editDate == index.date ? (
            <Input
              defaultValue={this.changeEvent}
              onChange={(e) => {
                this.changeEvent = e.target.value;
              }}
            />
          ) : (
            record
          ),
      },
      {
        title: '操作',
        dataIndex: 'address',
        key: Math.random(),
        render: (record, index) => this.renderOperation(record, index),
      },
    ];
    return (
      <div className="edit_dog_child">
        <Form>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
            rowClassName={(record, index) => this.setRowClassName(record, index)}
          />
        </Form>
        <Button onClick={this.addRow} type="primary" style={{ position: 'absolute', right: '51px', top: '-40px' }}>
          添加
        </Button>
        <Tag
          color="#2db7f5"
          style={{ left: '0px', position: 'absolute', top: '-37px' }}
          onClick={this.props.history.goBack}
        >
          <Icon type="rollback" />
          返回
        </Tag>
      </div>
    );
  }
}
export default Form.create()(EditDogChildren);

// WEBPACK FOOTER //
// ./src/components/admin/dogManage/breed/EditDogChildren.js
