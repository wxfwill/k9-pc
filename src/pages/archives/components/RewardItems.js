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
                    <th>姓名</th>
                    <td>{detailInfor.userName}</td>
                    <th>完成时间</th>
                    <td>{util.formatDate(new Date(detailInfor.completeDate), 'yyyy-MM-dd hh:mm:ss')}</td>
                  </tr>
                  <tr>
                    <th>加分原因</th>
                    <td colSpan="3">{detailInfor.reason}</td>
                  </tr>
                  <tr>
                    <th>详细情况</th>
                    <td colSpan="3">{detailInfor.particulars}</td>
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
