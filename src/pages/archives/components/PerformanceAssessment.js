// 绩效考核
import React, { Component } from 'react';
import NoData from 'components/NoData';
class PerformanceAssessment extends Component {
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
        <div className="performance-assessment">
          <div className="book-cont">
            {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
            {!detailInfor.noData ? (
              <div>
                <div className="mgt12 infor clearfix">
                  <div className="fl">
                    <img src={require('../../../images/archives/head.png')} width="32" height="32" />
                    <span className="name">张三</span>
                    <span className="team">一中队</span>
                    <span className="time">考评时间：2020-10-21</span>
                  </div>
                  <div className="fr">
                    总分：<b className="total">88</b>
                  </div>
                </div>
                <table border="1" bordercolor="#E7E7E7" className="table-box">
                  <thead>
                    <tr>
                      <th colSpan="4">价值观考核得分</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="no-wrap-td">
                      <td>价值观考核得分</td>
                      <td>分数</td>
                      <td>原因与事例</td>
                      <td>修改意见</td>
                    </tr>
                    <tr>
                      <td>表现/忠诚</td>
                      <td>10</td>
                      <td>表现忠诚相关内容表现忠诚相关内容表现忠诚相关内容</td>
                      <td>8</td>
                    </tr>
                  </tbody>
                </table>
                <table border="1" bordercolor="#E7E7E7" className="table-box">
                  <thead>
                    <tr>
                      <th colSpan="3">业务与内务考核得分</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="no-wrap-td">
                      <td>加减分原因</td>
                      <td>加减分变化</td>
                      <td>修改意见</td>
                    </tr>
                    <tr>
                      <td>受领导表扬</td>
                      <td>+2分</td>
                      <td>+1分</td>
                    </tr>
                  </tbody>
                </table>
                <table border="1" bordercolor="#E7E7E7" className="table-box">
                  <tbody>
                    <tr>
                      <td>
                        <h3 className="h3-txt">最终总分</h3>
                        <p className="p-txt">（价值观总分+50%警犬技能考核得分+业务与内务考核得分）</p>
                      </td>
                      <td className="total">88</td>
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
export default PerformanceAssessment;
