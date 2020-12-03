//电击枪领用
import React, { Component } from 'react';
import { Icon } from 'antd';
import NoData from 'components/NoData';

class ElectricGun extends Component {
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
                      <th>申请人</th>
                      <td>{detailInfor.applyUser}</td>
                      <th>申请部门</th>
                      <td>{detailInfor.groupName}</td>
                    </tr>
                    <tr>
                      <th>申请时间</th>
                      <td>
                        {detailInfor.applyTime &&
                          util.formatDate(new Date(detailInfor.applyTime), 'yyyy-MM-dd hh:mm:ss')}
                      </td>
                      <th>领用数量</th>
                      <td>{detailInfor.gunNum}</td>
                    </tr>
                    <tr>
                      <th>用途</th>
                      <td>{detailInfor.useWay}</td>
                      <th>子弹数量</th>
                      <td>{detailInfor.bulletNum}</td>
                    </tr>
                    <tr>
                      <th>电击枪编号</th>
                      <td colSpan="3">{detailInfor.gunNo && detailInfor.gunNo.split(',').join(' / ')}</td>
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
export default ElectricGun;
