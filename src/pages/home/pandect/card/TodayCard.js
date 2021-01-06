import React, {Component} from 'react';
import {Card, Tooltip} from 'antd';
import httpAjax from 'libs/httpAjax';
require('style/view/page/card.less');
require('style/view/home/todayCard.less');
class TodayCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      top: 0
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const _this = this;
    this.timer && clearInterval(this.timer);
    React.$ajax.home
      .todayLog()
      .then((res) => {
        const {data, code} = res;
        if (code == 0) {
          this.setState(
            {
              listData: data.concat(data)
            },
            function () {
              _this.handleScroll();
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        top: Math.abs(this.state.top) >= ulHeight ? -2 : this.state.top - 2
      });
    }, 150);
  }
  render() {
    return (
      <div className="today-card">
        <Card title={'今日动态'} className="layout-card" bordered={false}>
          <div className="TodayCard">
            <ul
              className="listWrapper"
              ref="list"
              style={{top: this.state.top}}
              onMouseEnter={this.handleEnter.bind(this)}
              onMouseLeave={this.handleLeave.bind(this)}>
              {this.state.listData.length > 0
                ? this.state.listData.map(function (item, index) {
                    return (
                      <Tooltip
                        placement="topLeft"
                        title={
                          <span>
                            【{item.type}】{item.time}
                            {item.content}
                          </span>
                        }
                        key={index}>
                        <li key={index}>
                          【{item.type}】{item.time}
                          {item.content}
                        </li>
                      </Tooltip>
                    );
                  })
                : null}
            </ul>
          </div>
        </Card>
      </div>
    );
  }
}

export default TodayCard;
