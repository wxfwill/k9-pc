import React, { Component } from 'react';
import classnames from 'classnames';
import httpAjax from 'libs/httpAjax';
import { Collapse, Icon, Tag, Row, Col, Table, Card } from 'antd';
const Panel = Collapse.Panel;

class OfficerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      baseArr: [],
      checkArr: [],
      title: '',
    };
  }
  componentWillMount() {
    const { caption } = this.props;
    this.fetch(caption);
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
  }
  handleShow() {
    this.props.handleShow();
  }
  fetch(params) {
    httpAjax('post', config.apiUrl + '/api/trainCheck/detail', { key: params })
      .then((res) => {
        const { data } = res;
        this.setState({
          title: data.title,
          baseArr: [
            {
              title: data.title,
              yearMonth: data.yearMonth,
              examinerName: data.examinerName,
              totalScore: data.totalScore,
              checkGrade: data.checkGrade,
              status: data.status,
              key: 0,
            },
          ],
          checkArr: [
            {
              id: 1,
              standard: '按质按量完成，效果达到预期标准',
              examination: '搜毒搜爆训练',
              score: data.searchScore,
              key: 1,
            },
            {
              id: 2,
              standard: '按质按量完成，效果达到预期标准',
              examination: '刑侦科目训练',
              score: data.criminalInvestigationScore,
              key: 2,
            },
            {
              id: 3,
              standard: '按质按量完成，效果达到预期标准',
              examination: '警犬使用',
              score: data.dogUseScore,
              key: 3,
            },
            {
              id: 4,
              standard: '按质按量完成，效果达到预期标准',
              examination: '训练考核',
              score: data.trainScore,
              key: 4,
            },
            {
              id: 5,
              standard: '按质按量完成，效果达到预期标准',
              examination: '理化管理',
              score: data.dailyScore,
              key: 5,
            },
          ],
          loading: false,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  renderhead(caption) {
    if (caption.length > 0) {
      let MonthYear = caption.split('_')[1];
      return (
        <div>
          <Icon type="calendar" />
          &nbsp;&nbsp;&nbsp;
          <Tag color="#2db7f5">{MonthYear}</Tag>
        </div>
      );
    }
  }
  checkHeader() {
    return (
      <div>
        <Icon type="bars" />
        &nbsp;&nbsp;&nbsp;
        <Tag color="#2db7f5">考核信息</Tag>
      </div>
    );
  }
  baseHeader() {
    return (
      <div>
        <Icon type="bars" />
        &nbsp;&nbsp;&nbsp;
        <Tag color="#2db7f5">基本信息</Tag>
      </div>
    );
  }
  getBaseColumns() {
    let _this = this;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '考核周期',
        dataIndex: 'yearMonth',
        key: 'yearMonth',
      },
      {
        title: '考核人(训犬员)',
        dataIndex: 'examinerName',
        key: 'examinerName',
      },
      {
        title: '总成绩',
        dataIndex: 'totalScore',
        key: 'totalScore',
      },
      {
        title: '当月考核排名',
        dataIndex: 'checkGrade',
        key: 'checkGrade',
      },
      {
        title: '考核状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          return status == 1 ? <Tag color="#2db7f5">通过</Tag> : <Tag color="#f50">未审核</Tag>;
        },
      },
    ];
    return columns;
  }
  getCheckColumns() {
    let _this = this;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '考核项目',
        dataIndex: 'examination',
        key: 'examination',
      },
      {
        title: '考核标准',
        dataIndex: 'standard',
        key: 'standard',
      },
      {
        title: '得分',
        dataIndex: 'score',
        key: 'score',
      },
    ];
    return columns;
  }
  render() {
    const { changeLeft, caption } = this.props;
    return (
      <div className={classnames('off-detail')} style={{ left: changeLeft ? '360px' : '100%' }}>
        <div className="detail-table">
          <Card title={this.state.title}>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel showArrow={false} header={this.baseHeader()} key="1">
                <Row gutter={24}>
                  <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Table
                      rowKey="id"
                      loading={this.state.loading}
                      columns={this.getBaseColumns()}
                      dataSource={this.state.baseArr}
                      pagination={false}
                      bordered
                    />
                  </Col>
                </Row>
              </Panel>
              <Panel showArrow={false} header={this.checkHeader()} key="2">
                <Row gutter={24}>
                  <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Table
                      rowKey="id2"
                      loading={this.state.loading}
                      columns={this.getCheckColumns()}
                      dataSource={this.state.checkArr}
                      pagination={false}
                      bordered
                    />
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Card>
        </div>
        <span className="cursor p-icon" onClick={this.handleShow.bind(this)}>
          <Icon type="right" />
        </span>
      </div>
    );
  }
}

export default OfficerDetail;

// WEBPACK FOOTER //
// ./src/components/view/tables/assess/OfficerDetail.js
