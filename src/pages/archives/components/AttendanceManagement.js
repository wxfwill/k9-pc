//考勤管理
import React, {Component} from 'react';
import {Icon} from 'antd';
import NoData from 'components/NoData';
class AttendanceManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailInfor: '',
      currentIndex: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      detailInfor: nextProps.detailInfor,
      currentIndex: nextProps.currentIndex
    });
  }
  //打印
  onPrint = (e) => {
    const {detailInfor} = this.state;
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    util.jQPrintPartialHtml('#print-view' + detailInfor.bookName + detailInfor.id);
  };
  render() {
    const {detailInfor, currentIndex} = this.state;
    const punchIn = {}; //上班打卡
    const clockOut = {}; //下班打卡
    const punchOut = []; //外出打卡
    if (detailInfor.workwxClockDetailDOS && detailInfor.workwxClockDetailDOS.length > 0) {
      detailInfor.workwxClockDetailDOS.map((item) => {
        if (item.checkinType === '上班打卡') {
          punchIn.checkinDate = item.checkinDate; //打卡时间
          punchIn.clockType = item.clockType; //打卡状态
          punchIn.exceptionType = item.exceptionType; // 异常
        }
        if (item.checkinType === '下班打卡') {
          clockOut.checkinDate = item.checkinDate; //打卡时间
          clockOut.clockType = item.clockType; //打卡状态
          clockOut.exceptionType = item.exceptionType; // 异常
        }
        if (item.checkinType === '外出打卡') {
          punchOut.push({
            checkinDate: item.checkinDate, //打卡时间
            locationTitle: item.locationTitle //打卡地点
          });
        }
      });
    }
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
                      <td>{detailInfor.userName}</td>
                      <th>部门</th>
                      <td>{detailInfor.groupName}</td>
                    </tr>
                    <tr>
                      <th>日期</th>
                      <td colSpan="3">{util.formatDate(new Date(detailInfor.clockDate), 'yyyy-MM-dd')}</td>
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
                      <th>上班（{util.formatDate(new Date(detailInfor.workDate), 'hh:mm')}）</th>
                      <td style={punchIn.clockType != '正常' ? {color: 'red'} : {}}>
                        {punchIn.clockType && punchIn.clockType === '旷工'
                          ? punchIn.exceptionType
                          : punchIn.checkinDate &&
                            util.formatDate(new Date(punchIn.checkinDate), 'yyyy-MM-dd  hh:mm:ss')}
                        {punchIn.clockType && punchIn.clockType === '旷工' ? (
                          ''
                        ) : (
                          <span style={{marginLeft: 6, whiteSpace: 'nowrap'}}>{punchIn.clockType}</span>
                        )}
                      </td>
                      <th>下班（{util.formatDate(new Date(detailInfor.offWorkDate), 'hh:mm')}）</th>
                      <td style={clockOut.clockType != '正常' ? {color: 'red'} : {}}>
                        {clockOut.clockType && clockOut.clockType === '旷工'
                          ? clockOut.exceptionType
                          : clockOut.checkinDate &&
                            util.formatDate(new Date(clockOut.checkinDate), 'yyyy-MM-dd  hh:mm:ss')}
                        {clockOut.clockType && clockOut.clockType === '旷工' ? (
                          ''
                        ) : (
                          <span style={{marginLeft: 6, whiteSpace: 'nowrap'}}>{clockOut.clockType}</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {punchOut && punchOut.length > 0 ? (
                  <table border="1" bordercolor="#E7E7E7" className="table-box">
                    <thead>
                      <tr>
                        <th colSpan="4">外出打卡</th>
                      </tr>
                    </thead>
                    <tbody className="no-wrap-th">
                      {punchOut.map((item) => {
                        return (
                          <tr>
                            <th>打卡时间</th>
                            <td>{util.formatDate(new Date(item.checkinDate), 'yyyy-MM-dd  hh:mm:ss')}</td>
                            <th>打卡地点</th>
                            <td>{item.locationTitle}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : null}
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
