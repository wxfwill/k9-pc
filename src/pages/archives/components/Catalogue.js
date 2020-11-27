//目录
import React, { Component } from 'react';
import 'style/pages/archives/components/Catalogue.less';
const muluList = [
  { name: '绩效考核信息', value: '绩效考核', isCurrent: true },
  { name: '工作用车信息', value: '工作用车' },
  { name: '出勤用车信息', value: '出勤用车' },
  // { name: '考勤管理信息', value: '考勤管理' },
  { name: '奖励事项信息', value: '奖励事项' },
  { name: '日报信息', value: '日报信息' },
];
class Catalogue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: '',
      jumpDirectory: null,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentIndex: nextProps.currentIndex,
      jumpDirectory: nextProps.jumpDirectory,
    });
  }
  //从目录跳转
  jumpDirectory = (e, name) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const { jumpDirectory } = this.state;
    jumpDirectory && jumpDirectory(name);
  };

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
                    <a onClick={(e) => this.jumpDirectory(e, item.value)}>
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
