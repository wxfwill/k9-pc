//目录
import React, { Component } from 'react';
const muluList = [
  { name: '绩效考核信息', isCurrent: true },
  { name: '工作用车信息' },
  { name: '出勤用车信息' },
  { name: '考勤管理信息' },
  { name: '奖励事项信息' },
  { name: '日报信息' },
];
class Catalogue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentIndex: nextProps.currentIndex,
    });
  }
  render() {
    const { currentIndex } = this.state;
    return (
      <div className="book-box">
        <div className="catalogue-main">
          <div className="book-cont">
            <div className="mulu">
              <i className="line"></i>
              <b>目录</b>
              <i className="line right"></i>
            </div>
            <ul className="mulu-list">
              {muluList.map((item, index) => {
                return (
                  <li key={index} className={item.isCurrent ? 'current' : ''}>
                    <a>
                      <b>{index + 1 < 10 ? '0' + (index + 1) : index + 1}</b>
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="page-foot">
          <span className="page-numb">{currentIndex}</span>
        </div>
      </div>
    );
  }
}
export default Catalogue;
