//MonitoringViewInfo
//监控查看信息
import React, {Component} from 'react';
import {Icon} from 'antd';
import NoData from 'components/NoData';

class MonitoringViewInfo extends Component {
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
                      <th>申请人</th>
                      <td>{detailInfor.userName}</td>
                      <th>申请部门</th>
                      <td>{detailInfor.groupName}</td>
                    </tr>
                    <tr>
                      <th>申请时间</th>
                      <td>
                        {detailInfor.applyDate &&
                          util.formatDate(new Date(detailInfor.applyDate), 'yyyy-MM-dd hh:mm:ss')}
                      </td>
                      <th>监控范围类型</th>
                      <td>{detailInfor.monitorType}</td>
                    </tr>
                    <tr>
                      <th>开始时间</th>
                      <td>
                        {detailInfor.startDate &&
                          util.formatDate(new Date(detailInfor.startDate), 'yyyy-MM-dd hh:mm:ss')}
                      </td>
                      <th>结束时间</th>
                      <td>
                        {detailInfor.endDate && util.formatDate(new Date(detailInfor.endDate), 'yyyy-MM-dd hh:mm:ss')}
                      </td>
                    </tr>
                    <tr>
                      <th>时长</th>
                      <td colSpan="3">{detailInfor.monitorHours}</td>
                    </tr>
                    <tr>
                      <th>查看事由</th>
                      <td colSpan="3">{detailInfor.reason}</td>
                    </tr>
                    <tr>
                      <th>监控查看具体范围</th>
                      <td colSpan="3">{detailInfor.monitorType}</td>
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
export default MonitoringViewInfo;
