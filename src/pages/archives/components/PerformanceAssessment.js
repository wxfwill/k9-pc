// 绩效考核
import React, { Component } from 'react';
import { Icon } from 'antd';
import NoData from 'components/NoData';
import 'style/pages/archives/components/PerformanceAssessment.less';
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
  //打印
  onPrint = (e) => {
    const { detailInfor } = this.state;
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    util.jQPrintPartialHtml('#print-view' + detailInfor.bookName + detailInfor.id);
  };
  render() {
    const { detailInfor, currentIndex } = this.state;
    const JZG = detailInfor ? detailInfor.assessmentValues : null; //价值观数据
    const Other = detailInfor ? detailInfor.otherReasonsDTOS : null; //业务与内务考核-其他加减分项参数
    return (
      detailInfor && (
        <div className="book-box">
          <div className="page-head">
            {detailInfor.bookName}信息
            {!detailInfor.noData ? <Icon type="printer" onClick={(e) => this.onPrint(e)} /> : null}
          </div>
          <div className="performance-assessment">
            <div className="book-cont">
              {detailInfor.$indexes ? <p className="title">{detailInfor.bookName}</p> : null}
              {!detailInfor.noData ? (
                <div
                  className="print-view performance-assessment-cont"
                  id={'print-view' + detailInfor.bookName + detailInfor.id}
                >
                  <div className="mgt12 infor clearfix">
                    <div className="fl">
                      <img src={require('../../../images/archives/head.png')} width="32" height="32" />
                      <span className="name">{detailInfor.userName}</span>
                      <span className="team">{detailInfor.squadronName}</span>
                      <span className="time">
                        考评时间：
                        {detailInfor.reportingDate
                          ? util.formatDate(new Date(detailInfor.reportingDate), 'yyyy-MM-dd hh:mm:ss')
                          : '--'}
                      </span>
                    </div>
                    <div className="fr">
                      总分：
                      <b className="total">
                        {detailInfor.selfEvaluationSumMark ? detailInfor.selfEvaluationSumMark + '分' : '待审核'}
                      </b>
                    </div>
                  </div>
                  {JZG && (
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
                          <td>{JZG.itemOneSelfMark}分</td>
                          <td>{JZG.itemOneExplain}</td>
                          <td>{JZG.itemOneSquadronMark ? JZG.itemOneSquadronMark + '分' : '待审核'}</td>
                        </tr>
                        <tr>
                          <td>激情/干净</td>
                          <td>{JZG.itemTwoSelfMark}分</td>
                          <td>{JZG.itemTwoExplain}</td>
                          <td>{JZG.itemTwoSquadronMark ? JZG.itemTwoSquadronMark + '分' : '待审核'}</td>
                        </tr>
                        <tr>
                          <td>团结/担当</td>
                          <td>{JZG.itemThreeSelfMark}分</td>
                          <td>{JZG.itemThreeExplain}</td>
                          <td>{JZG.itemThreeSquadronMark ? JZG.itemThreeSquadronMark + '分' : '待审核'}</td>
                        </tr>
                        <tr>
                          <td>奉献</td>
                          <td>{JZG.itemFourSelfMark}分</td>
                          <td>{JZG.itemFourExplain}</td>
                          <td>{JZG.itemFourSquadronMark ? JZG.itemFourSquadronMark + '分' : '待审核'}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {Other && (
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
                        {Other.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.reason}</td>
                              <td>{item.selfMark}分</td>
                              <td>{item.squadronMark ? item.squadronMark + '分' : '待审核'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  <table border="1" bordercolor="#E7E7E7" className="table-box">
                    <tbody>
                      <tr>
                        <td>
                          <h3 className="h3-txt">最终总分</h3>
                          <p className="p-txt">（价值观总分+50%警犬技能考核得分+业务与内务考核得分）</p>
                        </td>
                        <td className="total">
                          {detailInfor.selfEvaluationSumMark ? detailInfor.selfEvaluationSumMark + '分' : '待审核'}
                        </td>
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
      )
    );
  }
}
export default PerformanceAssessment;
