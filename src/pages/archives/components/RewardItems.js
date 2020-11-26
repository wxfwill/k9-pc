//奖励事项
import React, { Component } from 'react';
import NoData from 'components/NoData';
class RewardItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfor: '',
      currentIndex: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      detailInfor: nextProps.detailInfor,
      currentIndex: nextProps.currentIndex,
    });
  }
  render() {
    const { detailInfor, currentIndex } = this.state;
    return (
      <div className="book-box">
        <div className="page-head">{detailInfor.bookName}信息</div>
        <div className="reward-items">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <table border="1" bordercolor="#E7E7E7" className="table-box mgt12">
                <tbody className="no-wrap-th">
                  <tr>
                    <th>考勤类型</th>
                    <td colSpan="3">年假</td>
                  </tr>
                  <tr>
                    <th>开始时间</th>
                    <td>2020-11-15</td>
                    <th>结束时间</th>
                    <td>2020-11-15</td>
                  </tr>
                  <tr>
                    <th>详细描述</th>
                    <td colSpan="3">由于家里有事情，特申请休年假回家处理</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <NoData />
            )}
          </div>
        </div>
        <div className="page-foot">
          <span className="page-numb">{currentIndex}</span>
        </div>
      </div>
    );
  }
}
export default RewardItems;
