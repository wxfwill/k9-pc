import React from 'react';
import {Input, Icon, Button, Popconfirm, Select, message} from 'antd';
import httpAjax from 'libs/httpAjax';
const Option = Select.Option;
class StableEdit extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
    groupId: '',
    classId: '',
    optionArr: [],
    isChange: false,
    userId: this.props.userId
  };
  handleChange(value, option) {
    if (option.props.children !== this.state.value) {
      this.setState({
        isChange: true,
        userId: value && value.split('&')[0],
        groupId: value && value.split('&')[1],
        classId: value && value.split('&')[2],
        value: option.props.children
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const {value} = this.state;
    if (value != nextProps.value) {
      this.setState({value: nextProps.value});
    }
  }
  check = () => {
    const {rowNumber, udTime} = this.props;
    this.setState({editable: false});
    if (this.props.onChange && this.state.isChange) {
      const options = {
        userId: this.state.userId,
        groupId: this.state.groupId,
        dutyType: rowNumber,
        classId: this.state.classId,
        opDate: udTime
      };
      const hide = message.loading('数据提交中...', 0);
      this.props.onChange(options, hide);
      this.setState({isChange: false});
    }
  };
  edit = () => {
    const _this = this;
    const {rowNumber} = this.props;
    this.setState({editable: true}, function () {
      React.$ajax
        .postData('/api/onDuty/dutyUser', {dutyType: rowNumber})
        .then((res) => {
          const {data} = res;
          _this.setState({optionArr: data});
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };
  render() {
    const {value, editable} = this.state;
    const {optionArr} = this.state;
    return (
      <div className="editable-cell">
        {editable ? (
          <div className="editable-cell-input-wrapper">
            <Select value={value} style={{width: '100%'}} onChange={this.handleChange.bind(this)}>
              {optionArr.length > 0 &&
                optionArr.map((item, index) => {
                  return (
                    <Option key={index} value={item.userId + '&' + item.groupId + '&' + item.classId}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
            <Icon type="check" className="editable-cell-icon-check" onClick={this.check} />
          </div>
        ) : (
          <div className="editable-cell-text-wrapper">
            {value || ' '}
            <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}

export default StableEdit;

// WEBPACK FOOTER //
// ./src/components/admin/tables/ScheduleManage/SmartSchedule/StableEdit.js
