//出勤用车
import React, { Component } from 'react';
import NoData from 'components/NoData';
class AttendanceCar extends Component {
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
        <div className="attendance-car">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <div>
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
                  </tbody>
                </table>
                <table border="1" bordercolor="#E7E7E7" className="table-box">
                  <tbody className="no-wrap-th">
                    <tr>
                      <th>对讲机</th>
                      <td>-</td>
                      <th>对讲机耳机</th>
                      <td>-</td>
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
export default AttendanceCar;
