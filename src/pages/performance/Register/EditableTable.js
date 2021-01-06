import React from 'react';
import {Button, Table, Select, Popconfirm, Input, DatePicker, Form, message} from 'antd';
import moment from 'moment';
import Immutable from 'immutable';
import 'style/app/performance.less';
const Option = Select.Option;
const FormItem = Form.Item;
class EditableTableForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemData: this.props.autonomyData ? this.props.autonomyData : [],
      editable: false,
      subjectId: '1',
      itemId: '',
      score: '',
      examinerId: '',
      key: 0, //新增时临时key
      selectedRowKeys: [],
      SubjectItems: [],
      disabled: false,
      itemList: []
    };
  }
  componentWillMount() {
    //获取科目信息和指标信息
    const {typeId} = this.props;
    const {itemData} = this.state;
    React.$ajax.common.listSubjectItemByTypeId({id: typeId}).then((res) => {
      if (res.code == 0) {
        this.setState({SubjectItems: res.data});
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.itemData), Immutable.Map(nextProps.itemData))) {
      return;
    }
    const {itemData} = this.state;
    if (itemData != nextProps.itemData) {
      this.setState({itemData: nextProps.itemData});
    }
  }
  addPerformItem = () => {
    const {itemData, key} = this.state;
    const {autonomyData} = this.props;
    const newKey = 'key' + (key + 1);
    this.setState({key: newKey, score: ''});
    itemData.push({
      key: newKey,
      id: '',
      subjectId: '',
      itemId: '',
      score: ''
    });
    this.setState({itemData}, () => {
      itemData &&
        itemData.map((item, index) => {
          if (!(typeof item.key === 'undefined') && item.id == '') {
            item.editable = true;
            this.setState({disabled: true});
          }
        });
    });
  };
  editableCell(key, record) {
    const newData = [...this.state.itemData];
    let isEdit = true;
    newData.map((item, index) => {
      if (item.editable) {
        message.info('请先保存当前编辑的数据！');
        isEdit = false;
      }
    });
    if (!isEdit) {
      return;
    }
    this.onSelectChange(record.subjectId, key, 'subjectId');
    this.setState({
      subjectId: record.subjectId,
      score: record.score,
      examinerId: record.examinerId
    });
    /* const newData = [...this.state.itemData];
	 	 newData.map((item,index)=>{
	    	if(item.editable){
	    		delete item.editable;
	    	}
	    })*/
    const target = newData.filter((item) => key === item.id)[0];
    if (target) {
      target.editable = true;
      this.setState({itemData: newData});
    }
  }
  mapPerformanceCode = (code) => {};
  renderColumns(text, record, column) {
    const {SubjectItems, itemList} = this.state;
    const {getFieldDecorator} = this.props.form;
    const subjectList =
      SubjectItems &&
      SubjectItems.map((item, index) => {
        return (
          <Option value={item.id} key={index}>
            {item.subjectName}
          </Option>
        );
      });
    if (record.editable == true) {
      if (column == 'subjectId') {
        return (
          <div>
            <Form>
              <FormItem>
                {getFieldDecorator('subject', {
                  rules: [{required: true, message: '请选择考核科目!'}],
                  initialValue: (record && record.subjectId) || ''
                })(
                  <Select
                    initialValue={record.subjectId}
                    onChange={(value) => this.onSelectChange(value, record.id, column)}
                    style={{width: '100%'}}>
                    {subjectList}
                  </Select>
                )}
              </FormItem>
            </Form>
          </div>
        );
      } else {
        //选择科目时清空指标原有数据
        let isFlag = false;
        console.log(itemList, 'itemList');
        itemList &&
          itemList.map((item) => {
            if (item.props.value == record.itemId) {
              isFlag = true;
            }
          });
        return (
          <div>
            <Form>
              <FormItem>
                {getFieldDecorator('item', {
                  rules: [{required: true, message: '请选择指标名称!'}],
                  initialValue: isFlag ? (record && record.itemId) || '' : ''
                })(
                  <Select
                    initialValue={isFlag ? record.itemId : ''}
                    onChange={(value) => this.onSelectChange(value, record.id, column)}
                    style={{width: '100%'}}>
                    {itemList}
                  </Select>
                )}
              </FormItem>
            </Form>
          </div>
        );
      }
    } else {
      return text;
    }
  }
  //不可选日期
  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  disabledEndDate = (endValue) => {
    const startValue = this.state.startTime;
    if (startValue == '' || startValue == null) {
      return endValue && endValue < moment().endOf('day');
    } else {
      return moment(endValue).format('YYYY-MM-DD HH:mm:ss') < startValue;
    }
  };
  renderTimer(text, record, column) {}
  renderInput = (text, record, column) => {
    const {getFieldDecorator} = this.props.form;
    const {score} = this.state;
    if (record.editable == true) {
      if (column == 'score') {
        return (
          <Form>
            <FormItem>
              {getFieldDecorator('score', {
                rules: [
                  {required: true, message: '请输入考核分数'},
                  {pattern: /^-?[0-9]\d*$/, message: '请输入数字'}
                ], //,{len:1,message:'不得超过两位数'}
                initialValue: score
              })(<Input style={{margin: '-5px 0'}} onChange={(e) => this.onInputChange(e, text, record.id, column)} />)}
            </FormItem>
          </Form>
        );
      }
    } else {
      return text;
    }
  };
  //render考核人列表
  renderAllUsers = (text, record, column) => {};
  //修改的内容
  onInputChange(e, text, key, column) {
    const newData = [...this.state.itemData];
    const target = newData.filter((item) => key === item.id)[0];
    if (target) {
      if (column == 'score') {
        this.setState({score: e.target.value});
      }
      target[column] = e.target.value;
      this.setState({itemData: newData});
    }
  }
  onSelectChange = (value, key, column) => {
    let {itemList, itemData, SubjectItems} = this.state;
    if (column == 'subjectId') {
      SubjectItems.map((sub) => {
        if (sub.id == value) {
          itemList = sub.performanceCheckItemVOList.map((item, index) => {
            return (
              <Option value={item.id} key={index}>
                {item.item}
              </Option>
            );
          });
        }
      });

      this.setState({subjectId: value, itemList: itemList, itemId: '', score: ''});
    } else {
      let optScore = 0;
      const {subjectId} = this.state;
      SubjectItems.map((sub) => {
        if (sub.id == subjectId) {
          sub.performanceCheckItemVOList.map((item, index) => {
            if (item.id == value) {
              optScore = item.optScore;
            }
          });
        }
      });
      this.setState({itemId: value, score: optScore});
    }

    const newData = [...this.state.itemData];
    const target = newData.filter((item) => key === item.id)[0];
    if (target) {
      target[column] = value;
      this.setState({itemData: newData});
    }
  };
  //时间发生变化
  onTimerChange = (text, dateString, key, column) => {};
  //取消编辑
  cancel = (key) => {
    const newData = [...this.state.itemData];
    let oldData = [];
    if (key == '') {
      oldData = newData.filter((item) => key !== item.id);
    } else {
      oldData = newData;
      oldData.map((itme) => {
        delete itme.editable;
      });
    }
    this.setState({itemData: oldData, disabled: false});
  };
  //保存编辑内容
  save(id, key) {
    let {subjectId, startTime, endTime, address, score, remark, examinerId, content, reason, itemId} = this.state;
    const {checkDate, userId} = this.props;
    const newData = [...this.state.itemData];
    const target = newData.filter((item) => id === item.id)[0];
    const reqUrl = '';
    subjectId == null || subjectId == '' ? (subjectId = '1') : subjectId;
    if (target) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const examiner = values.examiner && values.examiner != undefined ? values.examiner.split('&')[0] : examinerId;
          delete target.editable;
          let options = {};

          if (id == '') {
            options = [
              {
                userId,
                itemId: itemId,
                subjectId,
                score: values.score,
                checkDate
              }
            ];
          } else {
            options = [
              {
                userId,
                id: id,
                subjectId,
                itemId: itemId,
                score: values.score,
                checkDate
              }
            ];
          }
          // this.setState({ itemData: newData });

          this.cacheData = newData.map((item) => ({...item}));
          React.$ajax.performance.savePerformanceCheckRecord(options).then((res) => {
            if (res.code == 0) {
              const data = [];
              newData.map((item) => {
                if ((item.id == '' && item.key == key) || item.id == id) {
                  item.id = res.data[0].id;
                  item.subjectName = res.data[0].subjectName;
                  item.examinerStr = res.data[0].examinerStr;
                  item.item = res.data[0].item;
                  item.score = res.data[0].score;
                }
                data.push(item);
              });
              this.setState({disabled: false, newData: data});
              let flag = '添加';
              key ? (flag = '修改') : flag;
              message.success(flag + '成功');
              this.props.updateTotalScore(values.score);
            } else {
              message.error('修改失败');
            }
          });
        }
      });
    }
  }
  //更新数据
  updateItemDate = () => {};
  RowSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  };
  deleteItem = () => {
    //const newData = [...this.state.itemData];
    const {selectedRowKeys} = this.state;
    const {autonomyData} = this.props;
    let newItemData = [];
    const options = {
      ids: selectedRowKeys
    };
    if (selectedRowKeys.length >= 1) {
      React.$ajax.performance.deletePerformanceCheckRecord(options).then((res) => {
        if (res.code == 0) {
          newItemData = autonomyData.filter(
            (item) => this.state.selectedRowKeys.map((rowid) => rowid).indexOf(item.id) < 0
          );
          message.success('删除成功');
          this.setState({
            itemData: newItemData
          });
        } else {
          message.error('删除失败');
        }
      });
    } else {
      message.warn('请选择要删除的内容');
    }
  };
  render() {
    const {editable, itemData, selectedRowKeys} = this.state;
    const {tabKey} = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.RowSelectChange
    };
    const itemColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '考核项目',
        dataIndex: 'subjectName',
        key: 'subjectName',
        render: (text, record) => this.renderColumns(text, record, 'subjectId')
      },
      {
        title: '指标名称',
        dataIndex: 'item',
        key: 'item',
        render: (text, record) => this.renderColumns(text, record, 'itemId')
      },
      {
        title: '考核人',
        dataIndex: 'examinerStr',
        key: 'examinerStr'
      },
      {
        title: '得分',
        dataIndex: 'score',
        key: 'score',
        render: (text, record) => this.renderInput(text, record, 'score')
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        width: 120,
        render: (text, record, index) => {
          const {editable} = record;
          return (
            <div className="editable-row-operations">
              {editable ? (
                <span>
                  <Button onClick={() => this.save(record.id, record.key)} size="small" style={{marginRight: '10px'}}>
                    保存
                  </Button>
                  <Popconfirm title="确定删除?" onConfirm={() => this.cancel(record.id)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <div>
                  <Button
                    size="small"
                    style={{marginRight: '10px'}}
                    onClick={() => this.editableCell(record.id, record)}>
                    编辑
                  </Button>
                </div>
              )}
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <div style={{marginBottom: '10px'}}>
          <Button
            size="small"
            type="primary"
            onClick={this.addPerformItem}
            style={{marginRight: '10px'}}
            disabled={this.state.disabled}>
            新增
          </Button>
          <Button size="small" onClick={this.deleteItem}>
            删除
          </Button>
        </div>
        <Table
          columns={itemColumns}
          dataSource={itemData}
          pagination={false}
          bordered
          rowSelection={rowSelection}
          rowKey="id"
          className="performanceTableForm"
        />
      </div>
    );
  }
}
const EditableTable = Form.create()(EditableTableForm);
export default EditableTable;

// WEBPACK FOOTER //
// ./src/components/admin/performance/Register/EditableTable.js
