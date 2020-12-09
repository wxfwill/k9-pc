//请假/离深/补休
import React, { Component } from 'react';
import { Icon } from 'antd';
import NoData from 'components/NoData';
class LeaveManagement extends Component {
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
    // util.jQPrintPartialHtml('#print-view' + detailInfor.bookName + detailInfor.id);
    util.jQPrintPartialHtml('#print-view' + '请假离深补休' + detailInfor.id);
  };
  render() {
    const { detailInfor, currentIndex } = this.state;
    return (
      <div className="book-box">
        <div className="page-head">
          {detailInfor.bookName}信息
          {!detailInfor.noData ? <Icon type="printer" onClick={(e) => this.onPrint(e)} /> : null}
        </div>
        <div className="attendance-management">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              // <div className="print-view" id={'print-view' + detailInfor.bookName + detailInfor.id}>
              <div className="print-view" id={'print-view' + '请假离深补休' + detailInfor.id}>
                <table border="1" bordercolor="#E7E7E7" className="table-box mgt12">
                  <tbody className="no-wrap-th">
                    <tr>
                      <th>请假类型</th>
                      <td colSpan="3">{detailInfor.leaveType}</td>
                    </tr>
                    <tr>
                      <th>开始时间</th>
                      <td>{util.formatDate(new Date(detailInfor.startDate), 'yyyy-MM-dd hh:mm:ss')}</td>
                      <th>结束时间</th>
                      <td>{util.formatDate(new Date(detailInfor.endDate), 'yyyy-MM-dd hh:mm:ss')}</td>
                    </tr>
                    <tr>
                      <th>详细描述</th>
                      <td colSpan="3">{detailInfor.reason}</td>
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
export default LeaveManagement;
