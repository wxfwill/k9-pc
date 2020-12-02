//犬粮申请
import React, { Component } from 'react';
import { Icon } from 'antd';
import NoData from 'components/NoData';

class DogFoodApply extends Component {
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
                      <td></td>
                      <th>申请部门</th>
                      <td></td>
                    </tr>
                    <tr>
                      <th>申请时间</th>
                      <td>{util.formatDate(new Date(detailInfor.startTime), 'yyyy-MM-dd hh:mm:ss')}</td>
                      <th>领用时间</th>
                      <td>{util.formatDate(new Date(detailInfor.endTime), 'yyyy-MM-dd hh:mm:ss')}</td>
                    </tr>
                    <tr>
                      <th>制作方式</th>
                      <td></td>
                      <th>制作类型</th>
                      <td></td>
                    </tr>
                    <tr>
                      <th>领用数量</th>
                      <td colSpan="3"></td>
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
export default DogFoodApply;
