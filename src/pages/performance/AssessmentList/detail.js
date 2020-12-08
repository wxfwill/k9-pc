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
      goundNum: 0,
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
      dogSkill: null, //警犬技能
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
  handleFormChange = (props, val, all) => {
    console.log(val);
    console.log(all);
  };
  getDetalData = (assessmentId) => {
    React.$ajax.postData('/api/performanceAssessment/getSelfEvaluation', { assessmentId }).then((res) => {
      if (res.code == 0) {
        let rsData = res.data;
        // let {
        //   itemOneSquadronMark,
        //   itemTwoSquadronMark,
        //   itemThreeSquadronMark,
        //   itemFourSquadronMark,
        // } = rsData.assessmentValues;
        let _id = Object.assign({}, this.state.assessmentValues, {
          id: rsData.assessmentValues.id,
          // itemOneSquadronMark,
          // itemTwoSquadronMark,
          // itemThreeSquadronMark,
          // itemFourSquadronMark,
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
        // this.setState({ assessmentValues: rsData.assessmentValues });
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
  getAllGrade = () => {
    let { setFieldsValue, getFieldValue } = this.props.form;
    console.log(getFieldValue('valueSquadronSumMark'));
    console.log(getFieldValue('businessSquadronSumMark'));
    let value = Number(getFieldValue('valueSquadronSumMark'));
    let bussobj = Number(getFieldValue('businessSquadronSumMark'));
    let dogGrade = Number(getFieldValue('dogSquadronSumMark1'));
    let all = value + bussobj + dogGrade;
    setFieldsValue({ selfEvaluationSumMark: all.toFixed(2) });
  };
  handleItemOne = (e, item) => {
    e.persist();
    let val = e.target.value;
    let { setFieldsValue, getFieldsValue } = this.props.form;
    let obj = getFieldsValue();
    console.log(obj);
    let num = 0;
    for (let key in obj) {
      if (key.includes('item') && key != item) {
        console.log(Number(obj[key]));
        num += Number(obj[key]);
      }
    }
    let allNum = (Number(val) + num).toFixed(2);
    setFieldsValue({ valueSquadronSumMark: allNum });
    this.getAllGrade();
  };
  handle4wMark = (e, item) => {
    e.persist();
    let val = e.target.value;
    let { setFieldsValue, getFieldsValue } = this.props.form;
    let obj = getFieldsValue();
    let num = 0;
    for (let key in obj) {
      if (key.includes('4wMark') && key != item) {
        num += Number(obj[key]);
      }
      if (key.includes('kqnMark') && key != item) {
        num += Number(obj[key]);
      }
      if (key.includes('otherMark') && key != item) {
        num += Number(obj[key]);
      }
    }
    let allNum = (Number(val) + num).toFixed(2);
    setFieldsValue({ businessSquadronSumMark: allNum });
    this.getAllGrade();
  };
  handleDogSkill = (e) => {
    e.persist();
    let val = e.target.value;
    let { setFieldsValue, getFieldsValue } = this.props.form;
    setFieldsValue({ dogSquadronSumMark1: (Number(val) / 2).toFixed(2) });
    this.getAllGrade();
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
        dogSquadronSumMark,
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
          dogSquadronSumMark,
        },
        () => {
          let {
            valueSquadronSumMark,
            selfEvaluationSumMark,
            businessSquadronSumMark,
            id,
            assessmentValues,
            dogSquadronSumMark,
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
              dogSquadronSumMark: Number(dogSquadronSumMark),
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
    if (!value.match(/^(0?|[\d|\-])+(\.\d{0,2})?$/g)) {
      callback('请输入小数位不超过2位的数字');
    }
    callback();
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    let { detalObj, assessmentValues } = this.state;
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
                    {/* <thead>
                      <tr>
                        <th colSpan="4">价值观考核得分</th>
                      </tr>
                    </thead> */}
                    <tbody>
                      <tr>
                        <th colSpan="4" className="center">
                          价值观考核得分
                        </th>
                      </tr>
                      <tr>
                        <th>类型</th>
                        <th>分数</th>
                        <th>原因与事例（可附件说明）</th>
                        <th>修改意见</th>
                      </tr>
                      <tr>
                        <th>表现/忠诚</th>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemOneSelfMark : defaltxt}</td>
                        <td>
                          {detalObj.assessmentValues.itemOneExplain
                            ? detalObj.assessmentValues.itemOneExplain
                            : defaltxt}
                        </td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('itemOneSquadronMark', {
                              initialValue: detalObj.assessmentValues
                                ? detalObj.assessmentValues.itemOneSquadronMark
                                : null,
                              rules: [{ validator: this.handleCustomRules }],
                            })(
                              <TextArea
                                rows={1}
                                onChange={(e) => this.handleItemOne(e, 'itemOneSquadronMark')}
                                disabled={this.state.isable}
                              />
                            )}
                          </Form.Item>
                        </td>
                      </tr>
                      <tr>
                        <th>激情/干净</th>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemTwoSelfMark : defaltxt}</td>
                        <td>
                          {detalObj.assessmentValues.itemTwoExplain
                            ? detalObj.assessmentValues.itemTwoExplain
                            : defaltxt}
                        </td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('itemTwoSquadronMark', {
                              initialValue: detalObj.assessmentValues
                                ? detalObj.assessmentValues.itemTwoSquadronMark
                                : null,
                              rules: [
                                {
                                  validator: this.handleCustomRules,
                                },
                              ],
                            })(
                              <TextArea
                                rows={1}
                                onChange={(e) => this.handleItemOne(e, 'itemTwoSquadronMark')}
                                disabled={this.state.isable}
                              />
                            )}
                          </Form.Item>
                        </td>
                      </tr>
                      <tr>
                        <th>团结/担当</th>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemThreeSelfMark : defaltxt}</td>
                        <td>
                          {detalObj.assessmentValues.itemThreeExplain
                            ? detalObj.assessmentValues.itemThreeExplain
                            : defaltxt}
                        </td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('itemThreeSquadronMark', {
                              initialValue: detalObj.assessmentValues
                                ? detalObj.assessmentValues.itemThreeSquadronMark
                                : null,
                              rules: [{ validator: this.handleCustomRules }],
                            })(
                              <TextArea
                                rows={1}
                                onChange={(e) => this.handleItemOne(e, 'itemThreeSquadronMark')}
                                disabled={this.state.isable}
                              />
                            )}
                          </Form.Item>
                        </td>
                      </tr>
                      <tr>
                        <th>奉献</th>
                        <td>{detalObj.assessmentValues ? detalObj.assessmentValues.itemFourSelfMark : defaltxt}</td>
                        <td>
                          {detalObj.assessmentValues.itemFourExplain
                            ? detalObj.assessmentValues.itemFourExplain
                            : defaltxt}
                        </td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('itemFourSquadronMark', {
                              initialValue: detalObj.assessmentValues
                                ? detalObj.assessmentValues.itemFourSquadronMark
                                : null,
                              rules: [{ validator: this.handleCustomRules }],
                            })(
                              <TextArea
                                rows={1}
                                onChange={(e) => this.handleItemOne(e, 'itemFourSquadronMark')}
                                disabled={this.state.isable}
                              />
                            )}
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
                        <td>{detalObj.valueSelfSumMark && detalObj.valueSelfSumMark}</td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('valueSquadronSumMark', {
                              initialValue: detalObj.valueSquadronSumMark,
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <th colSpan="4" className="center">
                          警犬技能考核
                        </th>
                      </tr>
                      <tr>
                        <th rowSpan="2" colSpan="2" style={{ textAlign: 'center' }}>
                          警犬技能考核
                        </th>
                        <th>分数</th>
                        <th>50%换算</th>
                      </tr>
                      <tr>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('dogSquadronSumMark', {
                              initialValue: detalObj.dogSquadronSumMark ? detalObj.dogSquadronSumMark : undefined,
                              rules: [{ validator: this.handleCustomRules }],
                            })(
                              <TextArea
                                rows={1}
                                disabled={this.state.isable}
                                onChange={(e) => this.handleDogSkill(e)}
                              />
                            )}
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('dogSquadronSumMark1', {
                              initialValue: detalObj.dogSquadronSumMark
                                ? (Number(detalObj.dogSquadronSumMark) / 2).toFixed(2)
                                : null,
                              // rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={true} />)}
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                    {/* <thead>
                      <tr>
                        <th colSpan="4">业务和内务考核得分</th>
                      </tr>
                    </thead> */}
                    <tbody>
                      <tr>
                        <th colSpan="4" className="center">
                          业务和内务考核得分
                        </th>
                      </tr>
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
                              <td>{item.selfMark}</td>
                              <td>
                                <Form.Item>
                                  {getFieldDecorator(`4wMark-${item.id}`, {
                                    initialValue: item.squadronMark ? item.squadronMark : null,
                                    rules: [{ validator: this.handleCustomRules }],
                                    // getValueFromEvent: (val) => {
                                    //   console.log(val);
                                    //   return val;
                                    // },
                                  })(
                                    <TextArea
                                      rows={1}
                                      disabled={this.state.isable}
                                      onChange={(e) => this.handle4wMark(e, `4wMark-${item.id}`)}
                                    />
                                  )}
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
                                    initialValue: item.squadronMark ? item.squadronMark : null,
                                    rules: [{ validator: this.handleCustomRules }],
                                  })(
                                    <TextArea
                                      rows={1}
                                      onChange={(e) => this.handle4wMark(e, `kqnMark-${item.id}`)}
                                      disabled={this.state.isable}
                                    />
                                  )}
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
                              <td>{item.selfMark}</td>
                              <td>
                                <Form.Item>
                                  {getFieldDecorator(`otherMark-${item.id}`, {
                                    initialValue: item.squadronMark ? item.squadronMark : null,
                                    rules: [{ validator: this.handleCustomRules }],
                                  })(
                                    <TextArea
                                      rows={1}
                                      onChange={(e) => this.handle4wMark(e, `otherMark-${item.id}`)}
                                      disabled={this.state.isable}
                                    />
                                  )}
                                </Form.Item>
                              </td>
                            </tr>
                          );
                        })}
                      <tr>
                        <th colSpan="2" style={{ textAlign: 'center' }}>
                          合计
                        </th>
                        <td>{detalObj.businessSelfSumMark ? detalObj.businessSelfSumMark : defaltxt}</td>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('businessSquadronSumMark', {
                              initialValue: detalObj.businessSquadronSumMark ? detalObj.businessSquadronSumMark : null,
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                      <tr>
                        <th colSpan="3" style={{ textAlign: 'center' }}>
                          <p>最终总得分</p>
                          <p>（价值观总分+50%警犬技能考核得分+业务和内务考核得分）</p>
                        </th>
                        <td>
                          <Form.Item>
                            {getFieldDecorator('selfEvaluationSumMark', {
                              initialValue: detalObj.selfEvaluationSumMark ? detalObj.selfEvaluationSumMark : undefined,
                              rules: [{ validator: this.handleCustomRules }],
                            })(<TextArea rows={1} disabled={this.state.isable} />)}
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Divider />
                  <div className="neck">
                    <Text>签名：</Text>
                    <Text>
                      <span style={{ paddingRight: '200px' }}>日期：</span>
                    </Text>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '20px' }} className="no-print">
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
