//日报信息
import React, { Component } from 'react';
import NoData from 'components/NoData';

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
  render() {
    const { detailInfor, currentIndex } = this.state;
    return (
      <div className="book-box">
        <div className="page-head">{detailInfor.bookName}</div>
        <div className="daily-information">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <div>
                <div className="mgt12 header">2020-10-21 日报信息</div>
                <div className="content">
                  <dl>
                    <dt>早晨（7:00-8:00）</dt>
                    <dd>早晨起床集合，在操场进行警犬训练</dd>
                  </dl>
                  <dl>
                    <dt>上午（9:00-11:30）</dt>
                    <dd>早晨起床集合，在操场进行警犬训练</dd>
                  </dl>
                  <dl>
                    <dt>下午（3:00-6:00）</dt>
                    <dd>早晨起床集合，在操场进行警犬训练</dd>
                  </dl>
                  <dl>
                    <dt>晚上（7:00-10:00）</dt>
                    <dd>早晨起床集合，在操场进行警犬训练</dd>
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
