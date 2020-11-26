//工作用车
import React, { Component } from 'react';
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
  render() {
    const { detailInfor, currentIndex } = this.state;
    return (
      <div className="book-box">
        <div className="page-head">{detailInfor.bookName}信息</div>
        <div className="transport-main">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <table border="1" bordercolor="#E7E7E7" className="table-box mgt12">
                <tbody className="no-wrap-th">
                  <tr>
                    <th>姓名</th>
                    <td>张三</td>
                    <th>用车类型</th>
                    <td>安检任务</td>
                  </tr>
                  <tr>
                    <th>开始时间</th>
                    <td>2020-11-15 09:00</td>
                    <th>结束时间</th>
                    <td>2020-11-15 15:00</td>
                  </tr>
                  <tr>
                    <th>用车时常</th>
                    <td>4小时</td>
                    <th>车牌号码</th>
                    <td>粤B-347829</td>
                  </tr>
                  <tr>
                    <th>用车目的地</th>
                    <td colSpan="3">深圳北站</td>
                  </tr>
                  <tr>
                    <th>同行人</th>
                    <td colSpan="3">张三、李四、王五</td>
                  </tr>
                  <tr>
                    <th>上报详情</th>
                    <td colSpan="3">2020年11月15日，应上级领导要求，到深圳北站执行安检任务，请求上级领导同意安排！</td>
                  </tr>
                </tbody>
              </table>
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
