import React, {Component} from 'react';
import classnames from 'classnames';
import httpAjax from 'libs/httpAjax';
import {Collapse, Icon, Tag, Row, Col, Table, Card, Tabs, message, Button, Spin} from 'antd';
import moment from 'moment';
import PerformanceItem from './PerformanceItemTable';
import 'style/view/common/detailTable.less';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
class PerformanceDetailTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      baseData: '',
      medicalrecords: [],
      title: '绩效考核',
      baseDataSource: [
        {
          name: '',
          yearMonth: ''
        }
      ],
      performceData: [],
      tabKey: '1',
      year: '',
      month: '',
      userId: '',
      spinLoading: false
    };
  }
  componentWillMount() {
    const performanceChangeWeek = JSON.parse(sessionStorage.getItem('performanceChangeWeek'));
    const userId = performanceChangeWeek.userId;
    const year = performanceChangeWeek && performanceChangeWeek.yearMonth.split('-')[0];
    const month = performanceChangeWeek && performanceChangeWeek.yearMonth.split('-')[1];
    this.setState({
      year: year,
      month: month,
      userId: userId
    });
    const params = {
      userId: userId,
      year: year,
      month: month
    };
    //获取基础数据
    this.fetch(params);
    //获取单个考核项目数据
    const reqUrl = config.apiUrl + '/api/trainCheck/listCheckSearch';
    this.getItemData(reqUrl, params);
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
  }
  fetch(params) {
    const reqUrl = config.apiUrl + '/api/trainCheck/listMonthlyCheckDetail';
    const {baseDataSource} = this.state;
    const baseDataArr = [];
    const obj = {};
    httpAjax('post', reqUrl, params)
      .then((res) => {
        const data = res.data;
        if (res.code == 0) {
          obj.name = data.userName;
          obj.yearMonth = data.yearMonth;
          baseDataArr.push(obj);
          this.setState({
            loading: false,
            baseDataSource: baseDataArr
          });
        }
      })
      .catch(function (error) {
        message.error('error');
      });
  }
  getItemData = (url, options) => {
    httpAjax('post', url, options).then((res) => {
      if (res.code == 0) {
        this.setState({performceData: res.data, spinLoading: false});
      }
    });
  };
  //tab卡切换
  itemChange = (value) => {
    this.setState({spinLoading: true});
    this.setState({tabKey: value});
    const {year, month, userId} = this.state;
    let reqUrl = '';
    const params = {
      userId: userId,
      year: year,
      month: month
    };
    const urlArr = [
      'listCheckSearch',
      'listCriminalInvestigation',
      'listCheckTrain',
      'listCheckDogUse',
      'listCheckDaily'
    ];
    reqUrl = config.apiUrl + '/api/trainCheck/' + urlArr[parseInt(value) - 1];
    setTimeout(() => {
      this.getItemData(reqUrl, params);
    }, 300);
  };
  getTitle(title) {
    return (
      <div>
        <Icon type="bars" />
        &nbsp;&nbsp;&nbsp;
        <Tag color="#2db7f5">{title}</Tag>
      </div>
    );
  }
  //通过审核
  passCheck = () => {
    const performanceChangeWeek = JSON.parse(sessionStorage.getItem('performanceChangeWeek'));
    const userId = performanceChangeWeek.userId;
    const checkYear = performanceChangeWeek && performanceChangeWeek.yearMonth.split('-')[0];
    const checkMonth = performanceChangeWeek && performanceChangeWeek.yearMonth.split('-')[1];
    const url = config.apiUrl + '/api/trainCheck/passCheck';
    const options = {
      userId: userId,
      year: checkYear,
      month: checkMonth
    };
    httpAjax('post', url, options).then((res) => {
      if (res.code == 0) {
        message.success('审核通过');
      } else {
        message.error('提交审核失败');
      }
    });
  };
  render() {
    const {baseDataSource, medicalrecords, loading, tabKey, performceData, spinLoading} = this.state;
    const baseColumns = [
      {
        title: '考核月份',
        dataIndex: 'yearMonth',
        key: 'yearMonth',
        render: () => {
          return baseDataSource[0].yearMonth;
        }
      },
      {
        title: '被考核人',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '职位',
        dataIndex: 'position',
        key: 'position'
      },
      {
        title: '部门',
        dataIndex: 'part',
        key: 'part'
      }
    ];
    return (
      <div className={classnames('off-detail')}>
        <div className="detail-table">
          <Card title={this.state.title}>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel showArrow={false} header={this.getTitle('基础信息')} key="1">
                <Table
                  loading={loading}
                  columns={baseColumns}
                  dataSource={baseDataSource}
                  pagination={false}
                  bordered
                  rowKey="id"
                />
              </Panel>
              <Panel showArrow={false} header={this.getTitle('考核项目')} key="2">
                <Tabs defaultActiveKey="1" onChange={this.itemChange}>
                  <TabPane tab="第一部分：搜毒搜爆科目训练" key="1">
                    <PerformanceItem
                      addPerformItem={this.addPerformItem}
                      itemData={performceData}
                      tabKey={tabKey}
                      getItemData={this.getItemData}
                    />
                  </TabPane>
                  <TabPane tab="第二部分：刑侦科目训练" key="2">
                    <PerformanceItem
                      addPerformItem={this.addPerformItem}
                      itemData={performceData}
                      tabKey={tabKey}
                      getItemData={this.getItemData}
                    />
                  </TabPane>
                  <TabPane tab="第三部分：训练考核" key="3">
                    <PerformanceItem
                      addPerformItem={this.addPerformItem}
                      itemData={performceData}
                      tabKey={tabKey}
                      getItemData={this.getItemData}
                    />
                  </TabPane>
                  <TabPane tab="第四部分：警犬的使用" key="4">
                    <PerformanceItem
                      addPerformItem={this.addPerformItem}
                      itemData={performceData}
                      tabKey={tabKey}
                      getItemData={this.getItemData}
                    />
                  </TabPane>
                  <TabPane tab="第五部分：理化管理" key="5">
                    <PerformanceItem
                      addPerformItem={this.addPerformItem}
                      itemData={performceData}
                      tabKey={tabKey}
                      getItemData={this.getItemData}
                    />
                  </TabPane>
                </Tabs>
                <div style={{marginTop: '20px', textAlign: 'center'}}>
                  <Button type="primary" onClick={this.passCheck}>
                    审核通过
                  </Button>
                </div>
                {spinLoading ? (
                  <div style={{position: 'fixed', top: '60%', left: '50%'}}>
                    <Spin size="large" />
                  </div>
                ) : (
                  ''
                )}
              </Panel>
            </Collapse>
          </Card>
        </div>
      </div>
    );
  }
}
export default PerformanceDetailTable;

// WEBPACK FOOTER //
// ./src/components/admin/tables/performanceAppraisal/PerformanceDetailTable.js
