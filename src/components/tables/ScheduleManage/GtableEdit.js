import React from 'react';
import {Input, Icon, Button, Popconfirm, Select, message} from 'antd';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
const Option = Select.Option;
class StableEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      editable: false,
      groupId: '',
      classId: '',
      optionArr: [],
      isChange: false,
      userId: this.props.userId
    };
  }

  handleChange(value, option) {
    const {rowNumber} = this.props;
    if (rowNumber % 2 == 0) {
      const newValue = [];
      const newUserId = [];
      if (rowNumber == 2 && value.length > 2) {
        message.info('雇员不能超过两人!');
        option.map((item, index) => {
          if (index < 2) {
            newValue.push(item.props.children);
            newUserId.push(item.key && item.key.split('&')[0]);
          }
        });
      } else {
        option.map((item, index) => {
          newValue.push(item.props.children);
          newUserId.push(item.key && item.key.split('&')[0]);
        });
      }
      this.setState({
        isChange: true,
        userId: newUserId,
        groupId: this.props.userId.length > 0 ? this.props.userId[0].split('&')[1] : '',
        classId: this.props.userId.length > 0 ? this.props.userId[0].split('&')[2] : '',
        value: newValue
      });
    } else {
      if (option.props.children !== this.state.value) {
        this.setState({
          isChange: true,
          groupId: this.props.userId ? this.props.userId.split('&')[1] : '',
          classId: this.props.userId ? this.props.userId.split('&')[2] : '',
          userId: option.key && option.key.split('&')[0],
          value: option.props.children
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    const {value} = this.state;
    if (value != nextProps.value) {
      this.setState({value: nextProps.value});
    }
  }
  check = () => {
    const {rowNumber} = this.props;
    this.setState({editable: false});
    if (this.props.onChange && this.state.isChange) {
      const options = {
        userId: this.state.userId,
        groupId: this.state.groupId,
        dutyType: rowNumber,
        classId: this.state.classId || 0
        //    opDate:moment(new Date()).format('x')
      };
      if (rowNumber % 2 == 0) {
        options.userIds = this.state.userId;
        options.userId = '';
      }
      switch (rowNumber) {
        case 0:
          options.dutyType = 5;
          break;
        case 1:
          options.dutyType = 1;
          break;
        case 2:
          options.dutyType = 2;
          break;
        case 3:
          options.dutyType = 3;
          break;
        case 4:
          options.dutyType = 4;
          break;
        case 5:
          options.dutyType = 3;
          break;
        case 6:
          options.dutyType = 4;
          break;
        default:
          options.dutyType = 1;
          break;
      }
      const hide = message.loading('数据提交中...', 0);
      this.props.onChange(options, hide);
      this.setState({isChange: false});
    }
  };
  edit = () => {
    const _this = this;
    const {rowNumber} = this.props;
    this.setState({editable: true}, function () {
      httpAjax('post', config.apiUrl + '/api/userCenter/getAllUsers', {
        dutyType: rowNumber == 6 ? rowNumber + 1 : rowNumber
      })
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
    const {rowNumber} = this.props;
    const children = [];
    optionArr.length > 0 &&
      optionArr.map((item, index) => {
        children.push(
          <Option key={item.id + '&' + item.groupId + '&' + item.classId} value={item.name}>
            {item.name}
          </Option>
        );
      });
    return (
      <div className="editable-cell" style={{height: rowNumber < 3 || rowNumber % 2 > 0 ? '' : '80px'}}>
        {editable ? (
          <div className="editable-cell-input-wrapper">
            <Select
              value={value}
              style={{width: '100%'}}
              mode={rowNumber % 2 > 0 ? '' : 'multiple'}
              onChange={this.handleChange.bind(this)}>
              {children}
            </Select>
            <Icon type="check" className="editable-cell-icon-check" onClick={this.check} />
          </div>
        ) : (
          <div className="editable-cell-text-wrapper">
            {rowNumber % 2 > 0 ? value : value.join('，') || ' '}
            <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}

export default StableEdit;

// WEBPACK FOOTER //
// ./src/components/admin/tables/ScheduleManage/GtableEdit.js
