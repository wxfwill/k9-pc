import React, {Component} from 'react';
import {Row, Col, Card, Button, Table, Divider, message, Popconfirm} from 'antd';
import NoData from 'components/NoData/index';
import AddRule from './addRule';
import 'style/pages/performance/AssessmentSetting/index.less';
class AssessmentSetting extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '小类',
        dataIndex: 'ruleName'
      },
      {
        title: '周期',
        dataIndex: 'ruleCycleNote'
      },
      {
        title: '周期内积分限制',
        dataIndex: 'integralLimit',
        render: (text) => <span>{text || '无'}</span>
      },
      {
        title: '分数',
        dataIndex: 'baseScore'
      },
      {
        title: '操作',
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.openAddRule('小类');
                this.setState({
                  redactData: record
                });
              }}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={() => this.deleteRule(record.id)}>
              <a style={{color: 'red'}}>删除</a>
            </Popconfirm>
          </span>
        )
      }
    ];
    this.state = {
      ruleTreeList: [],
      visible: false,
      redactData: null,
      AddRuleTitle: '',
      pid: undefined
    };
  }
  componentDidMount() {
    React.store.dispatch({type: 'NAV_DATA', nav: ['绩效考核', '考核指标设置']});
    this.getAllRule();
  }
  // 获取全部规则树
  getAllRule() {
    React.$ajax
      .getData('/api/integral-rule/queryAll')
      .then((res) => {
        if (res.code == 0) {
          this.setState({
            ruleTreeList: res.data
          });
        }
      })
      .catch((error) => {
        message.error(error.msg);
      });
  }

  //删除
  deleteRule(id) {
    React.$ajax
      .getData('/api/integral-rule/delCascade', {id})
      .then((res) => {
        if (res.code == 0) {
          this.getAllRule();
          const timer = setTimeout(() => {
            message.success('操作成功');
            clearTimeout(timer);
          });
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
      pid: pid || undefined
    });
  }
  //关闭表单窗口
  closeAddRule = () => {
    this.setState(
      {
        visible: false,
        redactData: null
      },
      () => {
        this.getAllRule();
      }
    );
  };
  render() {
    const {ruleTreeList, visible, redactData, pid, AddRuleTitle} = this.state;
    return (
      <div className="AssessmentSetting">
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <Button type="primary" size="large" icon="plus" onClick={() => this.openAddRule('大类')}>
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
                                  redactData: item
                                });
                              }}>
                              编辑
                            </a>
                            <Popconfirm title="确定删除?" onConfirm={() => this.deleteRule(item.id)}>
                              <a style={{color: 'red', marginLeft: 16}}>删除</a>
                            </Popconfirm>
                          </span>
                        }
                        style={{width: '49%'}}
                        actions={[
                          <Button type="primary" icon="plus" onClick={() => this.openAddRule('小类', item.id)}>
                            添加小类
                          </Button>
                        ]}>
                        <Table columns={this.columns} dataSource={item.children} pagination={false} rowKey="id" />
                      </Card>
                    );
                  })
                ) : (
                  <NoData />
                )}
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
