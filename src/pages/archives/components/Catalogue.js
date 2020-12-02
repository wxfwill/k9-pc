//目录
import React, { Component } from 'react';
import { muluList } from '../localData';
import 'style/pages/archives/components/Catalogue.less';
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
            <div className="mulu-box">
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
        </div>
        <div className="page-foot">
          <span className="page-numb">{currentIndex}</span>
        </div>
      </div>
    );
  }
}
export default Catalogue;
