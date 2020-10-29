import React, { Component } from 'react';
import { Table } from 'antd';
class CustomTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
        current: 1,
        onShowSizeChange: this.handleOnShowSizeChange,
        onChange: this.handleChangeSize,
      },
      selectedRowKeys: [],
    };
  }
  // 每页显示数量
  handleOnShowSizeChange = (cur, size) => {
    this.props.handleShowSizeChange && this.props.handleShowSizeChange(cur, size);
  };
  // 改变页码
  handleChangeSize = (page, pageSize) => {
    this.props.handleChangeSize && this.props.handleChangeSize(page, pageSize);
  };
  // 多选
  onSelectChange = (selectedRowKeys) => {
    this.props.handleSelectChange && this.props.handleSelectChange(selectedRowKeys);
  };
  render() {
    let { dataSource, columns, isBordered, pagination, loading, isRowSelects, rowSelectKeys } = this.props;
    if (!dataSource) {
      throw new Error('dataSource是必传参数');
    }
    if (!columns) {
      throw new Error('colums是必传参数');
    }

    // 分页
    let newPage = Object.assign({}, this.state.pagination, pagination);
    console.log('新的分页');
    console.log(newPage);
    // loading
    let newloading = loading ? loading : this.state.loading;
    // 是否多选
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: rowSelectKeys,
    };
    let newisRowSelects = isRowSelects ? rowSelection : null;

    return (
      <Table
        dataSource={dataSource}
        rowKey="id"
        columns={columns}
        loading={newloading}
        rowSelection={newisRowSelects}
        bordered={isBordered == true ? true : false}
        pagination={newPage}
      />
    );
  }
}

export default CustomTable;
