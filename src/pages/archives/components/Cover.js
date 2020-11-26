//封面
import React, { Component } from 'react';
class Cover extends Component {
  render() {
    return (
      <div className="cover-main">
        <div className="content">
          <div className="top">
            <p>档案号码：JC9347822</p>
            <p>员工编码：JC9347822</p>
          </div>
          <div className="national-emblem">
            <img src={require('images/archives/national-emblem.png')} with="105" height="114" />
            <p>深圳CID警犬基地</p>
            <p>员工档案</p>
          </div>
          <ul className="infor">
            <li>员工姓名：张飞舞</li>
            <li>制作单位：深圳CID警犬基地</li>
            <li>制作日期：2020-10-21</li>
          </ul>
        </div>
        <i className="crease"></i>
      </div>
    );
  }
}
export default Cover;
