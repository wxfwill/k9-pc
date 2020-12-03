//厨房物资领用
import React, { Component } from 'react';
import { Icon } from 'antd';
import NoData from 'components/NoData';

class KitchenMaterial extends Component {
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
                      <td colSpan="3">
                        {detailInfor.applyTime &&
                          util.formatDate(new Date(detailInfor.applyTime), 'yyyy-MM-dd hh:mm:ss')}
                      </td>
                    </tr>
                    <tr>
                      <th>申请理由</th>
                      <td colSpan="3">{detailInfor.applyReason}</td>
                    </tr>
                    <tr>
                      <th>总物品数量</th>
                      <td colSpan="3">{detailInfor.applySum}</td>
                    </tr>
                  </tbody>
                </table>
                {detailInfor.materialDetails && detailInfor.materialDetails.length > 0
                  ? detailInfor.materialDetails.map((item, index) => {
                      return (
                        <table border="1" bordercolor="#E7E7E7" className="table-box" key={index}>
                          <thead>
                            <tr>
                              <th colSpan="4">{`明细${index + 1}`}</th>
                            </tr>
                          </thead>
                          <tbody className="no-wrap-th">
                            <tr>
                              <th>物品名称</th>
                              <td>{item.name}</td>
                              <th>物品数量</th>
                              <td>{item.number}</td>
                            </tr>
                          </tbody>
                        </table>
                      );
                    })
                  : null}
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
export default KitchenMaterial;
