//封面
import React, { Component } from 'react';

class Cover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfor: {},
    };
  }
  componentDidMount() {
    this.props.userId &&
      React.$ajax.postData('/api/user/info', { id: this.props.userId }).then((res) => {
        if (res.code == 0) {
          this.setState({
            userInfor: res.data,
          });
        }
      });
  }
  render() {
    const { userInfor } = this.state;
    return (
      <div className="cover-main">
        <div className="content">
          <div className="top">
            <p>档案号码：{userInfor.number ? userInfor.number : '--'}</p>
            <p>员工编码：{userInfor.number ? userInfor.number : '--'}</p>
          </div>
          <div className="national-emblem">
            <img src={require('images/archives/national-emblem.png')} with="105" height="114" />
            <p>深圳CID警犬基地</p>
            <p>员工档案</p>
          </div>
          <ul className="infor">
            <li>员工姓名：{userInfor.name ? userInfor.name : '--'}</li>
            <li>制作单位：深圳CID警犬基地</li>
            <li>制作日期：{this.props.currentDate}</li>
          </ul>
        </div>
        <i className="crease"></i>
      </div>
    );
  }
}
export default Cover;
