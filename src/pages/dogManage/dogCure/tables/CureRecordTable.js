import React, {Component} from 'react';
import {Table, Badge, Menu, Dropdown, Icon, Tag, Row, Col} from 'antd';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
require('style/app/dogManage/dogCure/cviewtable.less');
class CureRecordTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      filter: null,
      yearMonth: '2018-02',
      detailTitle: '',
      changeLeft: false,
      showDetail: false
    };
  }
  getColumns() {
    const columns = [
      {
        title: '药品名称',
        dataIndex: 'drug',
        key: 'key'
      },
      {
        title: '次数',
        dataIndex: 'times',
        key: 'times'
      },
      {
        title: '天数',
        dataIndex: 'days',
        key: 'days'
      },
      {
        title: '使用方法',
        dataIndex: 'purpose',
        key: 'purpose'
      }
    ];
    return columns;
  }
  render() {
    const {dataSource} = this.props;
    return (
      <div>
        <div className="baseDataTable" style={{marginBottom: '10px'}}>
          <Row>
            <Col span={6}>发病日期</Col>
            <Col span={6}>{moment(dataSource.morbidityTime).format('YYYY-MM-DD')}</Col>
            <Col span={6}>发病症状</Col>
            <Col span={6}>{dataSource.symptom}</Col>
          </Row>
          <Row>
            <Col span={6}>疾病类型</Col>
            <Col span={6}>{dataSource && dataSource.disease ? dataSource.disease : '无'}</Col>
            <Col span={6}>诊断结果</Col>
            <Col span={6}>{dataSource.treatmentResults == 1 ? '治愈' : '未治愈'}</Col>
          </Row>
          <Row>
            <Col span={6}>兽医</Col>
            <Col span={6}>{dataSource.veterinaryName}</Col>
            <Col span={6}> &nbsp;</Col>
            <Col span={6}> &nbsp;</Col>
          </Row>
        </div>
        <Table
          className="components-table-demo-nested"
          pagination={false}
          loading={this.state.loading}
          columns={this.getColumns()}
          dataSource={dataSource.prescriptions}
          rowKey="key"
          bordered
        />
      </div>
    );
  }
}
export default CureRecordTable;

// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogCure/tables/CureRecordTable.js
