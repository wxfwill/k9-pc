import React, { Component } from 'react';
import { Row, Col, Card, Button, Table, Divider, message, Popconfirm, Typography, Form, Input } from 'antd';
import 'style/pages/performance/AssessmentSetting/detail.less';
const { Title, Text } = Typography;
const { TextArea } = Input;
class AssessmentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detalObj: null,
    };
  }
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['绩效考核', '绩效考核详情'] });
  }
  getDetalData = (assessmentId) => {
    React.$ajax.postData('/api/performanceAssessment/getSelfEvaluation', { assessmentId }).then((res) => {
      if (res.code == 0) {
      }
    });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="AssessmentDetail">
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <Title level={4} style={{ textAlign: 'center' }}>
                自评表
              </Title>
              <div className="neck">
                <Text>姓名：灰太狼</Text>
                <Text>中队：抓羊小分队</Text>
                <Text>总分：100</Text>
              </div>
              <Form>
                <table border="1" className="table-form">
                  <thead>
                    <tr>
                      <th colSpan="4">价值观考核得分</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th></th>
                      <th>分数</th>
                      <th>原因与事例（可附件说明）</th>
                      <th>修改意见</th>
                    </tr>
                    <tr>
                      <th>表现/忠诚</th>
                      <td>（系统自动带出信息）</td>
                      <td>（系统自动带出信息）</td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator('value1', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
                          })(<TextArea rows={1} />)}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <th>激情/干净</th>
                      <td>（系统自动带出信息）</td>
                      <td>（系统自动带出信息）</td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator('value2', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
                          })(<TextArea rows={1} />)}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <th>团结/担当</th>
                      <td>（系统自动带出信息）</td>
                      <td>（系统自动带出信息）</td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator('value3', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
                          })(<TextArea rows={1} />)}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <th>奉献</th>
                      <td>（系统自动带出信息）</td>
                      <td>（系统自动带出信息）</td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator('value4', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
                          })(<TextArea rows={1} />)}
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
                      <td>（系统自动带出信息）</td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator('value5', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
                          })(<TextArea rows={1} />)}
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
                    <tr>
                      <td colSpan="2">（系统自动带出信息，另外也可以手动填写）</td>
                      <td>（系统自动带出信息，另外也可以手动填写）</td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator('valuss', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
                          })(<TextArea rows={1} />)}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">（系统自动带出信息，另外也可以手动填写）</td>
                      <td>（系统自动带出信息，另外也可以手动填写）</td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator('valurr', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
                          })(<TextArea rows={1} />)}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <th colSpan="2" style={{ textAlign: 'center' }}>
                        合计
                      </th>
                      <td>（系统自动带出信息，另外也可以手动填写）</td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator('valuee', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
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
                          {getFieldDecorator('value6', {
                            rules: [{ required: true, message: '请填写修改意见！' }],
                          })(<TextArea rows={1} />)}
                        </Form.Item>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <Divider />
                <Button type="primary">保存</Button>
                <Button style={{ marginLeft: 16 }}>取消</Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
const AssessmentDetailForm = Form.create({ name: 'AssessmentDetail' })(AssessmentDetail);
export default AssessmentDetailForm;
