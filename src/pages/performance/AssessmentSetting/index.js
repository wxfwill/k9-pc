import React, { Component } from 'react';
import { Row, Col, Card, Button, Table, Divider, message } from 'antd';
import NoData from 'components/NoData/index';
import AddRule from './addRule';
import 'style/pages/performance/AssessmentSetting/index.less';
class AssessmentSetting extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '小类',
        dataIndex: 'ruleName',
        key: 'ruleName',
      },
      {
        title: '周期',
        dataIndex: 'ruleCycle',
        key: 'ruleCycle',
      },
      {
        title: '周期内积分限制',
        dataIndex: 'integralLimit',
        key: 'integralLimit',
      },
      {
        title: '分数',
        key: 'baseScore',
        dataIndex: 'baseScore',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.openAddRule('小类');
                this.setState({
                  redactData: record,
                });
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a style={{ color: 'red' }} onClick={() => this.deleteRule(record.id)}>
              删除
            </a>
          </span>
        ),
      },
    ];
    this.state = {
      ruleTreeList: [],
      visible: false,
      redactData: null,
      AddRuleTitle: '',
      pid: undefined,
    };
  }
  componentDidMount() {
    this.getAllRule();
  }
  // 获取全部规则树
  getAllRule() {
    React.httpAjax('get', config.apiUrl + '/api/integral-rule/queryAll')
      .then((res) => {
        if (res.code == 0) {
          this.setState({
            ruleTreeList: res.data,
          });
        }
      })
      .catch((error) => {
        message.error(error.msg);
      });
  }
  //编辑
  redact() {}
  //删除
  deleteRule(id) {
    React.httpAjax('get', config.apiUrl + '/api/integral-rule/delCascade', { params: { id: id } })
      .then((res) => {
        if (res.code == 0) {
          message.success('操作成功');
          this.getAllRule();
        }
      })
      .catch((error) => {
        message.error(error.msg);
      });
  }
  //打开表单窗口
  openAddRule(title, pid) {
    this.setState({
      visible: true,
      AddRuleTitle: title,
      pid: pid ? pid : undefined,
    });
  }
  //关闭表单窗口
  closeAddRule = () => {
    this.setState(
      {
        visible: false,
        redactData: null,
      },
      () => {
        this.getAllRule();
      }
    );
  };
  render() {
    const { ruleTreeList, visible, redactData, pid, AddRuleTitle } = this.state;
    return (
      <div className="AssessmentSetting">
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <Button type="primary" icon="plus" onClick={() => this.openAddRule('大类')}>
                添加大类
              </Button>
              <div className="card-list">
                {ruleTreeList && ruleTreeList.length > 0 ? (
                  ruleTreeList.map((item) => {
                    return (
                      <Card
                        title={item.ruleName}
                        key={item.id}
                        extra={
                          <span>
                            <a
                              onClick={() => {
                                this.openAddRule('大类');
                                this.setState({
                                  redactData: item,
                                });
                              }}
                            >
                              编辑
                            </a>
                            <a style={{ color: 'red', marginLeft: 16 }} onClick={() => this.deleteRule(item.id)}>
                              删除
                            </a>
                          </span>
                        }
                        style={{ width: '49%' }}
                        actions={[
                          <Button type="primary" icon="plus" onClick={() => this.openAddRule('小类', item.id)}>
                            添加小类
                          </Button>,
                        ]}
                      >
                        <Table columns={this.columns} dataSource={item.children} pagination={false} />
                      </Card>
                    );
                  })
                ) : (
                  <NoData />
                )}
                {/* <Card
                title="4w报备"
                extra={<a href="#">删除</a>}
                style={{ width: '49%' }}
                actions={[
                  <Button type="primary" icon="plus">
                    添加
                  </Button>,
                ]}
              >
                <Table columns={columns} dataSource={data} pagination={false} />
              </Card> */}
              </div>
            </Card>
          </Col>
        </Row>
        <AddRule
          title={AddRuleTitle}
          visible={visible}
          closeAddRule={this.closeAddRule}
          redactData={redactData}
          pid={pid}
        />
      </div>
    );
  }
}

export default AssessmentSetting;
