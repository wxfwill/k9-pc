import React from 'react';
import { Link } from 'react-router-dom';
import { Table, message, Tag, Badge, Button, Icon } from 'antd';
import httpAjax from 'libs/httpAjax';
import DailyFeedDetailTable from './DailyFeedDetailTable';
import Immutable from 'immutable';
require('style/view/common/deployTable.less');
class DailyFeedTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 5,
      currPage: 1,
      dataSource: [],
      loading: false,
      filter: null,
      detailSource: '',
      successColor: '#2db7f5',
      waringColor: 'volcano',
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
      this.setState({ filter }, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter,
        });
      });
    }
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    let { filter } = this.state;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...filter,
    });
  };
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    this.setState({ loading: true });
    httpAjax('post', config.apiUrl + '/api/feed/getDailyFeed', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({ dataSource: res.list, loading: false, pagination });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const { showDetail, changeLeft, detailSource, successColor, waringColor } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (id) => {
          return (
            <Badge
              count={id}
              style={{
                minWidth: '50px',
                fontSize: '12px',
                height: '16px',
                lineHeight: '16px',
                backgroundColor: '#99a9bf',
              }}
            />
          );
        },
      },
      {
        title: '犬舍',
        dataIndex: 'houseId',
        key: 'houseId',
      },
      {
        title: '犬名',
        dataIndex: 'dogName',
        key: 'dogName',
      },
      {
        title: '品种',
        dataIndex: 'dogBreed',
        key: 'dogBreed',
      },
      {
        title: '第一餐',
        dataIndex: 'firstMeal',
        key: 'firstMeal',
        render: (text, record, index) => {
          // 1 表示已喂  0 表示没喂
          return text === 1 ? <Icon type="check" /> : <Icon type="minus" />;
        },
      },
      {
        title: '第二餐',
        dataIndex: 'secondMeal',
        key: 'secondMeal',
        render: (text, record, index) => {
          // 1 表示已喂  0 表示没喂
          return text === 1 ? <Icon type="check" /> : <Icon type="minus" />;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          // 1 表示正常   0表示异常
          return text === 1 ? <Tag color={successColor}>正常</Tag> : <Tag color={waringColor}>异常</Tag>;
        },
      },
      {
        title: '清扫',
        dataIndex: 'isClean',
        key: 'isClean',
        render: (text, record, index) => {
          // 1 表示已清扫   0表示未清扫
          return text === 1 ? <Tag color={successColor}>已清扫</Tag> : <Tag color={waringColor}>未清扫</Tag>;
        },
      },
    ];
    return (
      <div>
        <Table
          rowKey="id"
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.dataSource}
          bordered
          pagination={this.state.pagination}
          rowKey="id"
          onChange={this.handleTableChange}
        />
        {showDetail ? (
          <DailyFeedDetailTable handleShow={this.handleShow} detailSource={detailSource} changeLeft={changeLeft} />
        ) : (
          ''
        )}
      </div>
    );
  }
}
export default DailyFeedTable;

// WEBPACK FOOTER //
// ./src/components/view/tables/dog/DailyFeedTable.js
