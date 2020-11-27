//工作用车
import React, { Component } from 'react';
import NoData from 'components/NoData';

class Transport extends Component {
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
        <div className="transport-main">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <table border="1" bordercolor="#E7E7E7" className="table-box mgt12">
                <tbody className="no-wrap-th">
                  <tr>
                    <th>姓名</th>
                    <td>{detailInfor.applyUser}</td>
                    <th>用车类型</th>
                    <td>{detailInfor.carUseType}</td>
                  </tr>
                  <tr>
                    <th>开始时间</th>
                    <td>{util.formatDate(new Date(detailInfor.startTime), 'yyyy-MM-dd hh:mm:ss')}</td>
                    <th>结束时间</th>
                    <td>{util.formatDate(new Date(detailInfor.endTime), 'yyyy-MM-dd hh:mm:ss')}</td>
                  </tr>
                  <tr>
                    <th>用车时常</th>
                    <td>{detailInfor.usedTime}小时</td>
                    <th>车牌号码</th>
                    <td>{detailInfor.carNo}</td>
                  </tr>
                  <tr>
                    <th>用车目的地</th>
                    <td colSpan="3">{detailInfor.carUseDest}</td>
                  </tr>
                  <tr>
                    <th>同行人</th>
                    <td colSpan="3">{detailInfor.peerUser}</td>
                  </tr>
                  <tr>
                    <th>上报详情</th>
                    <td colSpan="3">{detailInfor.carUseReason}</td>
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
export default Transport;
