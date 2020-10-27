import React, { Component } from 'react';
import { Table, Button, Icon, message, Card, Tag, Tooltip, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import GtableEdit from './GtableEdit';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';
import 'style/app/editCell.less';
const localSVG = require('images/banglocation.svg');
const Panel = Collapse.Panel;
// require('style/view/common/deployTable.less');
require('style/view/common/deployTable.less');
class SubTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 10,
      currPage: 1,
      data: [],
      DutyUsers: [],
      loading: false,
      filter: null,
      changeLeft: false,
      showDetail: false,
    };
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    let filter = nextProps.filter;
    let isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      let _this = this;
      this.setState({ filter, data: [] }, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter,
          trainDate: filter.trainDate && filter.trainDate.format('x'),
        });
      });
    }
  }

  fetch(params) {
    this.setState({ loading: true });
    let _this = this;
    httpAjax('post', config.apiUrl + '/api/onDuty/dutyUserGroup', { ...params })
      .then((res) => {
        let data = res.data.groups;
        _this.handleData(data, function (data) {
          _this.setState({ data, DutyUsers: res.data.onDutyUsers, loading: false });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleData(data, callBack) {
    let tableData = [];
    data.map((item) => {
      let columnsHeader = [
        {
          userName: '队长',
          userId: 2,
        },
        {
          userName: '雇员',
          userId: 3,
        },
        {
          userName: '一班班长',
          userId: 4,
        },
        {
          userName: '一班队员',
          userId: 5,
        },
        {
          userName: '二班班长',
          userId: 6,
        },
        {
          userName: '二班队员',
          userId: 7,
        },
      ];
      item.data = [];
      columnsHeader.forEach((i, index) => {
        item.key = index + 'key';
        let content = '';
        if (index == 0) {
          content = item.leader;
        }
        switch (index) {
          case 0:
            content = item.leader;
            break;
          case 1:
            content = item.employees;
            if (content.length <= 0) {
              content = [];
              content.push({
                id: '0',
                name: '',
                userId: '',
                classId: 0,
                groupId: item.groupId,
              });
            }
            break;
          case 2:
            content = item.classList[0].header;
            //    content.groupId=item.classList[0].others[0].groupId
            //    content.classId=item.classList[0].others[0].classId

            break;
          case 3:
            content = item.classList[0].others;
            if (content && content.length <= 0) {
              content = [];
              content.push({
                id: '0',
                name: '',
                userId: '',
                classId: item.classList[0].classId,
                groupId: item.classList[0].groupId,
              });
            }
            break;
          case 4:
            content = item.classList[1].header;
            //    content.groupId=item.classList[1].others[0].groupId
            //    content.classId=item.classList[1].others[0].classId
            break;
          case 5:
            content = item.classList[1].others;
            if (content && content.length <= 0) {
              content = [];
              content.push({
                id: '0',
                name: '',
                userId: '',
                classId: item.classList[1].classId,
                groupId: item.classList[1].groupId,
              });
            }
            break;
          default:
            content = '';
            break;
        }
        item.data.push({
          columnsHeader: columnsHeader[index],
          content: content,
        });
      });
      tableData.push(item);
    });
    callBack(tableData);
  }

  handleTableData(content, row, index, colHeader) {
    let value = [];
    let userId = [];
    if ((index + 1) % 2 == 0) {
      content.map((item) => {
        if (item.name) value.push(item.name + '');
        userId.push(item.userId + '&' + item.groupId + '&' + item.classId);
      });
    } else {
      value = content.name;
      userId = content.userId + '&' + content.groupId + '&' + content.classId;
    }
    let obj = {
      children:
        typeof content !== 'undefined' ? (
          <GtableEdit
            value={value}
            userId={userId}
            rowNumber={index + 1}
            onChange={this.handleDataChange}
            udTime={colHeader}
          ></GtableEdit>
        ) : (
          ''
        ),
      props: {},
    };
    return obj;
  }

  handleDataChange(options, hide) {
    httpAjax('post', config.apiUrl + '/api/onDuty/updateUser', { ...options })
      .then((res) => {
        if (res.code == 0) {
          hide();
          message.success('更改成功！', 1);
        }
      })
      .catch((error) => {
        hide();
        message.error('服务端错误', 1);
        console.log(error);
      });
  }

  mapPeoples = (arr, type) => {
    const peos = arr.map((t) => t.userName);
    const ids = arr.map((t) => t.id);
    return type == 'id' ? ids : peos.join(',');
  };
  renderCardItem = (item) => {
    const pathname = this.props.pathname.indexOf('app') >= 0 ? 'app' : 'view';
    console.log(item);
    console.log('=============123');
    return (
      <Card
        // extra={item.saveStatus ==0?<Tag color="#f50">未发布</Tag>:<Tag color="#108ee9">已发布</Tag>}
        key={item.groupId}
        style={{ width: '48%', display: 'inline-block', margin: '0 2% 2% 0' }}
        bodyStyle={{ padding: '15px 32px' }}
      >
        <div className="item_body">
          <Table
            rowKey={(row) => {
              return 'key-' + row.columnsHeader.userId;
            }}
            loading={this.state.loading}
            columns={this.getColumns(item.groupName)}
            dataSource={item.data}
            pagination={false}
            bordered
            onChange={this.handleTableChange}
          />
        </div>
      </Card>
    );
  };

  getColumns(groupName) {
    let _this = this;
    const columns = [
      {
        title: '队名',
        dataIndex: 'columnsHeader',
        width: '20%',
        key: 'columnsHeader',
        render: (columnsHeader) => {
          return columnsHeader.userName;
        },
      },
      {
        title: groupName,
        dataIndex: 'content',
        width: '80%',
        key: 'content',
        render: (content, row, index) => {
          return _this.handleTableData(content, row, index, groupName);
        },
      },
    ];
    return columns;
  }
  baseHeader = (title) => {
    return (
      <div>
        <Icon type="bars" />
        &nbsp;&nbsp;&nbsp;
        <Tag color="#2db7f5">{title}</Tag>
      </div>
    );
  };

  render() {
    let { DutyUsers } = this.state;
    let value = [];
    let userId = [];
    DutyUsers.map((item) => {
      value.push(item.name + '');
      userId.push(item.userId + '&' + item.groupId + '&' + item.classId);
    });
    return (
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel showArrow={false} header={this.baseHeader('值班室人员')} key="1">
          <span>值班室人员: </span>
          <div style={{ display: 'inline-table', width: '90%' }}>
            <GtableEdit value={value} userId={userId} rowNumber={0} onChange={this.handleDataChange}></GtableEdit>
          </div>
        </Panel>
        <Panel showArrow={false} header={this.baseHeader('排班人员')} key="2">
          <div className="dogCureTable" style={{ paddingTop: '0' }}>
            {this.state.data.map((item) => {
              return this.renderCardItem(item);
            })}
            {this.state.data.length == 0 ? (
              <div style={{ textAlign: 'center', color: '#999', marginTop: 12, height: 32, lineHeight: '32px' }}>
                {' '}
                暂无数据
              </div>
            ) : (
              ''
            )}
          </div>
        </Panel>
      </Collapse>
    );
  }
}
export default SubTable;

// WEBPACK FOOTER //
// ./src/components/admin/tables/ScheduleManage/GroupScheduleTable.js
