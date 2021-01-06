//查询时间
import React, {Component} from 'react';
import {Icon, DatePicker, Form, Popover} from 'antd';
import moment from 'moment';
import 'style/pages/archives/components/SearchDate.less';

const {RangePicker} = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16}
  }
};

const dateFormat = 'YYYY-MM-DD';

class SearchDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
      startDate: '',
      endDate: '',
      dateArr: ''
    };
  }
  componentDidMount() {
    const timer = setTimeout(() => {
      //悬浮目录延迟出现
      this.setState({
        opacity: 1
      });
      clearTimeout(timer);
    }, 1000);

    this.setState(
      {
        startDate: this.props.startDate,
        endDate: this.props.endDate
      },
      () => {
        this.setState({
          dateArr: [moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]
        });
      }
    );
  }
  //获取时间
  getPicker = (e) => {
    if (e && e.length > 0) {
      this.setState(
        {
          startDate: e[0].format('YYYY-MM-DD') + ' ' + '00:00:00',
          endDate: e[1].format('YYYY-MM-DD') + ' ' + '23:59:59'
        },
        () => {
          this.props.getPicker(this.state.startDate, this.state.endDate);
        }
      );
    }
  };

  render() {
    const {opacity, dateArr} = this.state;
    const content = (
      <div>
        <Form.Item {...formItemLayout} className="search-date-form">
          <RangePicker value={dateArr} format={dateFormat} onChange={(e) => this.getPicker(e)} />
        </Form.Item>
      </div>
    );
    return (
      <div className="search-date" style={{opacity: opacity}}>
        <Popover content={content} title="查询时间" trigger="click">
          <Icon type="calendar" onClick={this.setIsShow} />
        </Popover>
      </div>
    );
  }
}
export default SearchDate;
