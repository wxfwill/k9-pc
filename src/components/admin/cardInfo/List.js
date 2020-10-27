import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message} from 'antd';
import {Link} from 'react-router-dom';
import Immutable from 'immutable';

class DogTable extends Component{
  constructor(props){
    super(props);

    this.state={
      dataSource: [],
      loading: false,
      pagination: {
        pageSize: 10,
        currPage: 1,
        total: 0,
      },
      selectedRowKeys: []
    }

    this.columns = [];
  }
  setNewState(data){
    let { dataSource, loading, pagination  } = data;
    this.setState({
      dataSource,
      loading,
      pagination
    })
  }
  componentWillReceiveProps(nextProps) {
      this.setNewState(nextProps)
  }
  componentWillMount(){
    this.setNewState(this.props);

    console.log(this.props.columns)
    this.columns = this.props.columns ? this.props.columns : [];
  }
  handleTableChange=(pagination)=>{
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.props.pageChange && this.props.pageChange(pagination);

  }
  render(){
    const { dataSource, loading, pagination, selectedRowKeys }=this.state;
    return (
      <div>
        <Table  
          dataSource={dataSource} 
          columns ={this.columns}
          loading={loading} 
          onChange={this.handleTableChange}
          pagination={pagination}
          bordered
          rowKey="pass_plate"
        />
      </div>
    )
  }
}
export default DogTable;