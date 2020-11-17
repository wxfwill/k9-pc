import React, { Component } from 'react';
import { Row, Col, Card, Button, Table, Divider, message, Popconfirm, Typography, Form, Input } from 'antd';
import { withRouter } from 'react-router-dom';
import 'style/pages/performance/AssessmentSetting/detail.less';
const { Title, Text } = Typography;
const { TextArea } = Input;
const defaltxt = '（系统自动带出信息）';
class AssessmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detalObj: null,
      isable: false,
      valueSquadronSumMark: null, // 价值观中队长修改后
      selfEvaluationSumMark: null, // 最终总分
      businessSquadronSumMark: null, // 业务考核总分
      id: null, // 考核id
      assessmentValues: {
        id: null,
        itemOneSquadronMark: null,
        itemTwoSquadronMark: null,
        itemThreeSquadronMark: null,
        itemFourSquadronMark: null,
      },
      attendanceStatisticsDTOS: [], // 考请
      fourWReportStatisticsDTOS: [], // 4w报备
      otherReasonsDTOS: [], // 其他
    };
  }
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['绩效考核', '绩效考核详情'] });
    if (util.urlParse(this.props.location.search).detalId) {
      let id = util.urlParse(this.props.location.search).detalId;
      this.getDetalData(id);
    } else {
      // this.props.history.goBack();
    }
    if (util.urlParse(this.props.location.search).type == 'detal') {
      this.setState({ isable: true });
    } else {
      this.setState({ isable: false });
    }
  }
  getDetalData = (assessmentId) => {
    React.$ajax.postData('/api/performanceAssessment/getSelfEvaluation', { assessmentId }).then((res) => {
      if (res.code == 0) {
        let rsData = res.data;
        let _id = Object.assign({}, this.state.assessmentValues, {
          id: rsData.assessmentValues.id,
        });
        this.setState({
          detalObj: rsData,
          fourWReportStatisticsDTOS: rsData.fourWReportStatisticsDTOS,
          id: rsData.id,
          assessmentValues: _id,
          valueSquadronSumMark: rsData.valueSquadronSumMark,
          selfEvaluationSumMark: rsData.selfEvaluationSumMark,
          businessSquadronSumMark: rsData.businessSquadronSumMark,
        });
      }
    });
  };
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.history.goBack();
  };
  handlePrint = () => {
    util.jQPrintPartialHtml('.AssessmentDetail');
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(err);
      if (err) {
        return;
      }
      let obj = values;
      let fouer4w = [];
      let kqArr = [];
      let otherArr = [];
      for (let key in obj) {
        // 4w报备
        if (key.toString().indexOf('4wMark') > -1) {
          let arr1 = key.split('-');
          fouer4w.push({ id: Number(arr1[1]), squadronMark: Number(obj[key]) });
        }
        // 考勤
        if (key.toString().indexOf('kqnMark') > -1) {
          let arr2 = key.split('-');
          kqArr.push({ id: Number(arr2[1]), squadronMark: Number(obj[key]) });
        }
        // 其他
        if (key.toString().indexOf('otherMark') > -1) {
          let arr3 = key.split('-');
          otherArr.push({ id: Number(arr3[1]), squadronMark: Number(obj[key]) });
        }
      }
      let {
        itemOneSquadronMark,
        itemTwoSquadronMark,
        itemThreeSquadronMark,
        itemFourSquadronMark,
        selfEvaluationSumMark,
        businessSquadronSumMark,
        valueSquadronSumMark,
      } = values;

      let _assessmentValues = Object.assign({}, this.state.assessmentValues, {
        itemOneSquadronMark: Number(itemOneSquadronMark),
        itemTwoSquadronMark: Number(itemTwoSquadronMark),
        itemThreeSquadronMark: Number(itemThreeSquadronMark),
        itemFourSquadronMark: Number(itemFourSquadronMark),
      });

      this.setState(
        {
          assessmentValues: _assessmentValues,
          attendanceStatisticsDTOS: kqArr,
          fourWReportStatisticsDTOS: fouer4w,
          otherReasonsDTOS: otherArr,
          selfEvaluationSumMark,
          businessSquadronSumMark,
          valueSquadronSumMark,
        },
        () => {
          let {
            valueSquadronSumMark,
            selfEvaluationSumMark,
            businessSquadronSumMark,
            id,
            assessmentValues,
            attendanceStatisticsDTOS,
            fourWReportStatisticsDTOS,
            otherReasonsDTOS,
          } = this.state;

          React.$ajax
            .postData('/api/performanceAssessment/approvalSelfEvaluation', {
              valueSquadronSumMark: Number(valueSquadronSumMark),
              selfEvaluationSumMark: Number(selfEvaluationSumMark),
              businessSquadronSumMark: Number(businessSquadronSumMark),
              id,
              assessmentValues,
              attendanceStatisticsDTOS,
              fourWReportStatisticsDTOS,
              otherReasonsDTOS,
            })
            .then((res) => {
              if (res.code == 0) {
                message.success('保存成功');
                this.props.history.goBack();
              }
            });
        }
      );
    });
  };
  handleCustomRules = async (rule, value, callback) => {
    if (!value) {
      throw new Error('请输入修改意见');
    }
    if (!value.match(/^\d+$/g)) {
      callback('请输入纯数字(⊙o⊙)…');
    }
    callback();
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    let { detalObj } = this.state;
    return (
      <div className="AssessmentDetail">
        {detalObj ? (
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card bordered={false}>
                <Title level={4} style={{ textAlign: 'center' }}>
                  自评表
                </Title>
                <div className="neck">
                  <Text>姓名：{detalObj.userName}</Text>
                  <Text>中队：{detalObj.squadronName}</Text>
                  <Text>
                    {detalObj.selfEvaluationSumMark ? <span>总分：{detalObj.selfEvaluationSumMark}</span> : null}
                  </Text>
                </div>
                <Form onSubmit={this.handleSubmit}>
                  <table border="1" className="table-form">
                    <thead>
                      <tr>
                        <th colSpan="4">价值观考核得分</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>类型</th>
                        <th>分数</th>
                        <th>原因与事例（可附件说明）</th>
                        <th>修改意见</th>
                      </tr>
                      <tr>
                        <th>表现/忠诚</th>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemOneSelfMark : defaltxt}</td>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemOneExplain : defaltxt}</td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('itemOneSquadronMark', {
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                      <tr>
                        <th>激情/干净</th>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemTwoSelfMark : defaltxt}</td>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemTwoExplain : defaltxt}</td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('itemTwoSquadronMark', {
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                      <tr>
                        <th>团结/担当</th>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemThreeSelfMark : defaltxt}</td>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemThreeExplain : defaltxt}</td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('itemThreeSquadronMark', {
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                      <tr>
                        <th>奉献</th>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemFourSelfMark : defaltxt}</td>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemFourExplain : defaltxt}</td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('itemFourSquadronMark', {
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <th rowSpan="2" colSpan="2" style={{ textAlign: 'center' }}>
                          价值观考核
                        </th>
                        <th>自评总分</th>
                        <th>中队修改后</th>
                      </tr>
                      <tr>
                        <td>{detalObj.valueSelfSumMark ? detalObj.valueSelfSumMark : defaltxt}</td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('valueSquadronSumMark', {
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                    <thead>
                      <tr>
                        <th colSpan="4">业务和内务考核得分</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th colSpan="2">加减分原因</th>
                        <th>加减分变化</th>
                        <th>修改意见</th>
                      </tr>
                      {/* 4w报备 */}
                      {detalObj.fourWReportStatisticsDTOS &&
                        detalObj.fourWReportStatisticsDTOS.map((item, index) => {
                          return (
                            // <React.Fragment>
                            <tr key={index}>
                              <td colSpan="2">{item.reason}</td>
                              <td>{item.selfMark}66</td>
                              <td>
                                <Form.Item>
                                  {getFieldDecorator(`4wMark-${item.id}`, {
                                    rules: [{ required: true, message: '请填写修改意见' }],
                                  })(<TextArea rows={1} disabled={this.state.isable} />)}
                                </Form.Item>
                              </td>
                            </tr>
                            // </React.Fragment>
                          );
                        })}
                      {/* 考勤 */}
                      {detalObj.attendanceStatisticsDTOS &&
                        detalObj.attendanceStatisticsDTOS.map((item, index) => {
                          return (
                            <tr key={item.reason}>
                              <td colSpan="2">{item.reason}</td>
                              <td>{item.selfMark ? item.selfMark : defaltxt}</td>
                              <td>
                                <Form.Item>
                                  {getFieldDecorator(`kqnMark-${item.id}`, {
                                    rules: [{ required: true, message: '请填写修改意见' }],
                                  })(<TextArea rows={1} disabled={this.state.isable} />)}
                                </Form.Item>
                              </td>
                            </tr>
                          );
                        })}
                      {/* 其他 */}
                      {detalObj.otherReasonsDTOS &&
                        detalObj.otherReasonsDTOS.map((item, index) => {
                          return (
                            <tr key={item.reason}>
                              <td colSpan="2">{item.reason}</td>
                              <td>{item.selfMark + '其他'}</td>
                              <td>
                                <Form.Item>
                                  {getFieldDecorator(`otherMark-${item.id}`, {
                                    rules: [{ required: true, message: '请填写修改意见' }],
                                  })(<TextArea rows={1} disabled={this.state.isable} />)}
                                </Form.Item>
                              </td>
                            </tr>
                          );
                        })}
                      <tr>
                        <th colSpan="2" style={{ textAlign: 'center' }}>
                          合计
                        </th>
                        <td>（系统自动带出信息，另外也可以手动填写）</td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('businessSquadronSumMark', {
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} />)}
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan="3" style={{ textAlign: 'center' }}>
                          <p>最终总得分</p>
                          <p>（价值观总分+50%警犬技能考核得分+业务和内务考核得分）</p>
                        </th>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('selfEvaluationSumMark', {
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  <Divider />
                  <div style={{ textAlign: 'center' }} className="no-print">
                    {util.urlParse(this.props.location.search).type == 'approval' ? (
                      <Button type="primary" htmlType="submit">
                        保存
                      </Button>
                    ) : null}
                    <Button style={{ marginLeft: 16 }} type="primary" onClick={this.handlePrint}>
                      打印
                    </Button>
                    <Button style={{ marginLeft: 16 }} onClick={this.handleCancel}>
                      取消
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}
const AssessmentDetailForm = Form.create({ name: 'AssessmentDetail' })(AssessmentDetail);
export default withRouter(AssessmentDetailForm);
