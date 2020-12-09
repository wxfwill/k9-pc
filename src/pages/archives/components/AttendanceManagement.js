//考勤管理
import React, { Component } from 'react';
import { Icon } from 'antd';
import NoData from 'components/NoData';
class AttendanceManagement extends Component {
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
        <div className="attendance-management">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <div className="print-view" id={'print-view' + detailInfor.bookName + detailInfor.id}>
                <table border="1" bordercolor="#E7E7E7" className="table-box mgt12">
                  <tbody className="no-wrap-th">
                    <tr>
                      <th>姓名</th>
                      <td>--</td>
                      <th>部门</th>
                      <td>--</td>
                    </tr>
                    <tr>
                      <th>日期</th>
                      <td colSpan="3">{util.formatDate(new Date(detailInfor.startDate), 'yyyy-MM-dd')}</td>
                    </tr>
                  </tbody>
                </table>
                <table border="1" bordercolor="#E7E7E7" className="table-box">
                  <thead>
                    <tr>
                      <th colSpan="4">上下班打卡</th>
                    </tr>
                  </thead>
                  <tbody className="no-wrap-th">
                    <tr>
                      <th>上班（07:00）</th>
                      <td>--</td>
                      <th>下班（22:00）</th>
                      <td>--</td>
                    </tr>
                  </tbody>
                </table>
                <table border="1" bordercolor="#E7E7E7" className="table-box">
                  <thead>
                    <tr>
                      <th colSpan="4">外出打卡</th>
                    </tr>
                  </thead>
                  <tbody className="no-wrap-th">
                    <tr>
                      <th>打卡时间</th>
                      <td>--</td>
                      <th>打卡地点</th>
                      <td>--</td>
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
export default AttendanceManagement;
