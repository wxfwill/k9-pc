//工作用车
import React, { Component } from 'react';
import { Icon } from 'antd';
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
  //打印
  onPrint = (e) => {
    const { detailInfor } = this.state;
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    util.jQPrintPartialHtml('#print-view' + detailInfor.bookName + detailInfor.id);
  };
  render() {
    const { detailInfor, currentIndex } = this.state;
    return (
      <div className="book-box">
        <div className="page-head">
          {detailInfor.bookName}信息
          {!detailInfor.noData ? <Icon type="printer" onClick={(e) => this.onPrint(e)} /> : null}
        </div>
        <div className="transport-main">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <div className="print-view" id={'print-view' + detailInfor.bookName + detailInfor.id}>
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
                      <th>用车时长</th>
                      <td>{detailInfor.usedTimeDescription}</td>
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
              </div>
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
