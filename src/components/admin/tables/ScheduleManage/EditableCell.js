import React from 'react';
import {Table, Input, Icon, Button, Popconfirm, Select, Row, Col} from 'antd';
import httpAjax from 'libs/httpAjax';
import 'style/app/editCell.less';
const Option = Select.Option;
class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value.name,
      editable: false,
      optionsArr: [],
      selectValue: '',
      remark: this.props.value.name,
      record: this.props.record,
      editLeader: false,
      editEmployee: false
    };
  }
  componentWillReceiveProps(nextProps) {
    const {value, rowHeaderTitle, remark} = this.state;
    if (value != nextProps.value) {
      this.setState({value: nextProps.value && nextProps.value.name, record: nextProps.record});
    }
  }
  selectChange = (value) => {
    this.setState({selectValue: value});
  };
  check = () => {
    this.setState({editable: false});
    if (this.props.onChange) {
      const {selectValue} = this.state;
      if (this.props.index == 8) {
        this.props.value.name = this.state.value;
      } else {
        if (selectValue) {
          if (this.props.index == 5 || this.props.index == 7) {
            this.props.value.name = selectValue && selectValue.split('&')[1];
            this.props.value.groupId = selectValue && selectValue.split('&')[2];
            this.props.value.classId = selectValue && selectValue.split('&')[3];
          } else {
            this.props.value.userId = selectValue && selectValue.split('&')[0];
            this.props.value.name = selectValue && selectValue.split('&')[1];
          }
        }
      }
      this.props.onChange(selectValue, this.props.index, this.props.value);
    }
  };
  edit = (value) => {
    sessionStorage.setItem('editDutyUser', value);
    const {index} = this.props;
    this.setState({editable: true});
    const reqUrl = config.apiUrl + '/api/onDuty/dutyUser';
    let optionsArr = [];
    const groupId = index == 4 ? this.props.value && this.props.value.groupId : index + 1;
    httpAjax('post', reqUrl, {groupId: groupId, dutyType: index + 1}).then((res) => {
      optionsArr = res.data;
      this.setState({optionsArr: res.data});
    });
  };
  editLeader = () => {
    this.setState({editLeader: true});
  };
  editEmployee = () => {
    this.setState({editEmployee: true});
  };
  render() {
    const {value, editable, editLeader, optionsArr, record} = this.state;
    const dutyUser =
      optionsArr &&
      optionsArr.map((item, index) => {
        return (
          <Option key={index} value={item.userId + '&' + item.name + '&' + item.groupId + '&' + item.classId}>
            {item.name}
          </Option>
        );
      });
    return (
      <div className="editable-cell">
        {editable ? (
          this.props.index < 8 ? (
            <div className="editable-cell-input-wrapper">
              <Select
                defaultValue={value}
                style={{width: '100%'}}
                placeholder="请选择排班人员"
                onChange={this.selectChange}>
                {dutyUser}
              </Select>
              <Icon type="check" className="editable-cell-icon-check" onClick={this.check} />
            </div>
          ) : (
            <div className="editable-cell-input-wrapper">
              <Input.TextArea
                placeholder="请输入备注信息！"
                defaultValue={value}
                onChange={(e) => {
                  this.setState({value: e.target.value});
                }}
                autosize={{minRows: 2, maxRows: 24}}
              />
              <Icon type="check" className="editable-cell-icon-check" onClick={this.check} />
            </div>
          )
        ) : this.props.index < 8 ? (
          <div className="editable-cell-text-wrapper">
            {value || ' '}
            <Icon type="edit" className="editable-cell-icon" onClick={() => this.edit(value)} />
          </div>
        ) : (
          <div className="editable-cell-text-wrapper" style={{textAlign: 'left'}}>
            <pre className="editable-font-family" style={{display: 'inline'}}>
              {value || ' '}
            </pre>
            <Icon type="edit" className="editable-cell-icon" onClick={() => this.edit(value)} />
          </div>
        )}
      </div>
    );
  }
}
export default EditableCell;

// WEBPACK FOOTER //
// ./src/components/admin/tables/ScheduleManage/EditableCell.js
