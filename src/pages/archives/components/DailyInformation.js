//日报信息
import React, { Component } from 'react';
import { Icon } from 'antd';
import NoData from 'components/NoData';
import 'style/pages/archives/components/DailyInformation.less';

class DailyInformation extends Component {
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
        <div className="page-head clearfix">
          {detailInfor.bookName}
          {!detailInfor.noData ? <Icon type="printer" onClick={(e) => this.onPrint(e)} /> : null}
        </div>
        <div className="daily-information">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <div
                className="print-view daily-information-cont"
                id={'print-view' + detailInfor.bookName + detailInfor.id}
              >
                <div className="mgt12 header">2020-10-21 日报信息</div>
                <div className="content">
                  <dl>
                    <dt>早晨（7:00-8:00）</dt>
                    <dd>{detailInfor.morn}</dd>
                  </dl>
                  <dl>
                    <dt>上午（9:00-11:30）</dt>
                    <dd>{detailInfor.forenoon}</dd>
                  </dl>
                  <dl>
                    <dt>下午（3:00-6:00）</dt>
                    <dd>{detailInfor.afternoon}</dd>
                  </dl>
                  <dl>
                    <dt>晚上（7:00-10:00）</dt>
                    <dd>{detailInfor.night}</dd>
                  </dl>
                </div>
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
export default DailyInformation;
