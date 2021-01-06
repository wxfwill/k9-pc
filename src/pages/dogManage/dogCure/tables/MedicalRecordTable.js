import React, {Component} from 'react';
import {Table, Badge, Menu, Dropdown, Icon, Tag} from 'antd';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
require('style/app/dogManage/dogCure/cviewtable.less');
class MedicalRecordTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false
    };
  }
  getColumns() {
    const columns = [
      {
        title: '发病时间',
        dataIndex: 'morbidityTime',
        key: 'morbidityTime',
        render: (time) => {
          return moment(time).format('YYYY-MM-DD');
        }
      },
      {
        title: '症状',
        dataIndex: 'symptom',
        key: 'symptom'
      },
      {
        title: '治疗结果',
        dataIndex: 'treatmentResults',
        key: 'treatmentResults',
        render: (status) => {
          return status == 1 ? <Tag color="#2db7f5">未治愈</Tag> : <Tag color="#f50">治愈</Tag>;
        }
      },
      {
        title: '疾病类型',
        dataIndex: 'disease',
        key: 'disease'
      }
    ];
    return columns;
  }
  expandedRowRender = (record) => {
    if (record.prescriptions && record.prescriptions.length == 0) {
      return <p style={{textAlign: 'center'}}>没有更多数据...</p>;
    }
    const columns = [
      {
        title: '药品名称',
        dataIndex: 'drug',
        key: 'key'
      },
      {
        title: '用药数量',
        dataIndex: 'times',
        key: 'times'
      },
      {
        title: '用药天数',
        dataIndex: 'days',
        key: 'days'
      },
      {
        title: '使用方法',
        dataIndex: 'purpose',
        key: 'purpose'
      }
    ];
    record.prescriptions.forEach((item, index) => {
      item.key = Math.random();
    });
    return <Table columns={columns} dataSource={record.prescriptions} pagination={false} bordered={false} />;
  };
  render() {
    return (
      <Table
        className="components-table-demo-nested"
        pagination={false}
        loading={this.state.loading}
        //onChange={this.handleTableChange}
        columns={this.getColumns()}
        expandedRowRender={this.expandedRowRender}
        dataSource={this.props.dataSource}
        rowKey="key"
      />
    );
  }
}
export default MedicalRecordTable;

// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogCure/tables/MedicalRecordTable.js
