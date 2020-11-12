import React, { Component } from 'react';
import httpAjax from 'libs/httpAjax';
import { cookieUtil } from 'libs/util';
import sessionStorage from 'redux-persist/es/storage/session';

var list = [
  {
    title: '训练',
    content: '05121陈北平 17:10 训练完毕',
  },
  {
    title: '外勤',
    content: '05743陈寿才 16:10驾驶粤B88332出勤',
  },
  {
    title: '养护',
    content: '05533 朱庆秋 17：20  乐乐的异常处理完毕',
  },
  {
    title: '训练',
    content: '陈北平 17:10 训练完毕',
  },
  {
    title: '外勤',
    content: '05743陈寿才 16:10驾驶粤B88332 出勤',
  },
  {
    title: '养护',
    content: '陈北平 17:10 训练完毕',
  },
  {
    title: '训练',
    content: '05121陈北平 17:10 训练完毕',
  },
  {
    title: '异常',
    content: '66332 李明 18:20 “奥迪”异常信息上报',
  },
  {
    title: '训练',
    content: '陈北平 17:10 训练完毕',
  },
  {
    title: '外勤',
    content: '05743陈寿才 16:10驾驶粤B88332出勤',
  },
  {
    title: '训练',
    content: '05121陈北平 17:10 训练完毕',
  },
  {
    title: '外勤',
    content: '05743陈寿才 16:10驾驶粤B88332出勤',
  },
  {
    title: '养护',
    content: '05533 朱庆秋 17：20  乐乐的异常处理完毕',
  },
  {
    title: '训练',
    content: '陈北平 17:10 训练完毕',
  },
  {
    title: '外勤',
    content: '05743陈寿才 16:10驾驶粤B88332 出勤',
  },
  {
    title: '养护',
    content: '陈北平 17:10 训练完毕',
  },
  {
    title: '训练',
    content: '05121陈北平 17:10 训练完毕',
  },
  {
    title: '异常',
    content: '66332 李明 18:20 “奥迪”异常信息上报',
  },
  {
    title: '训练',
    content: '陈北平 17:10 训练完毕',
  },
  {
    title: '外勤',
    content: '05743陈寿才 16:10驾驶粤B88332出勤',
  },
];

require('style/view/page/card.less');
class TodayCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      top: 0,
    };
  }
  componentDidMount() {
    this.timer && clearInterval(this.timer);
    this.handleScroll();
    this.getDutyData();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  handleEnter() {
    clearInterval(this.timer);
  }
  handleLeave() {
    this.handleScroll();
  }
  handleScroll() {
    clearInterval(this.timer);
    var ulHeight = this.refs.list.offsetHeight / 2;
    var top = Math.abs(parseInt(this.refs.list.style.top));
    this.timer = setInterval(() => {
      this.setState({
        top: Math.abs(this.state.top) >= ulHeight ? -2 : this.state.top - 2,
      });
    }, 150);
  }
  // /api/overView/todayLog
  getDutyData = () => {
    let user = {};
    sessionStorage.getItem('user').then((res) => {
      user = JSON.parse(res);
      React.$ajax.home.todayLog().then((res) => {
        this.setState({ listData: res.data }, this.handleScroll);
      });
    });
  };
  render() {
    return (
      <div className="TodayCard">
        <ul
          className="listWrapper"
          ref="list"
          style={{ top: this.state.top, padding: 0 }}
          onMouseEnter={this.handleEnter.bind(this)}
          onMouseLeave={this.handleLeave.bind(this)}
        >
          {this.state.listData.map(function (item, index) {
            return (
              <li style={{ fontSize: '14px' }} key={index}>
                {item.content}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default TodayCard;

// WEBPACK FOOTER //
// ./src/components/view/home/card/TodayCard.js
