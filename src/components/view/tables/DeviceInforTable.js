import React from 'react';
import {Link} from 'react-router-dom';
import {Table,message} from 'antd';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';

class DeviceInforTable extends React.Component{
	constructor(props){
		super();
	    this.state={
	      pagination: {
	        showSizeChanger:true,
	        showQuickJumper :true,
	        defaultCurrent:1
	      },
	      pageSize:3,
	      currPage:1,
	      dataSource:[],
	      loading:false,
	      filter:null
	    }
	}
  	componentWillMount() {
    	this.fetch();
  	}
  	componentWillReceiveProps(nextProps) {
			if(Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
				return
			}
  		let filter = nextProps.filter;
	    let isReset = util.method.isObjectValueEqual(nextProps,this.props);
	    if(!isReset){
	    	let _this = this;
		    this.setState({filter},function(){
		      _this.fetch({
		        pageSize:_this.state.pageSize,
		        currPage:1,
		        ...filter
		      });
		    })
	    }
  	}
  	handleTableChange=(pagination, filters, sorter)=>{
	    const pager = { ...this.state.pagination };
			pager.current = pagination.current;
			let {filter} = this.state;
	    this.setState({
	      pagination: pager,
	    });
	    this.fetch({
	      pageSize: pagination.pageSize,
				currPage: pagination.current,
				...filter
	    });
  	}	
  	fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
	    this.setState({ loading: true });
	    httpAjax('post',config.apiUrl+'/api/warehouseManagement/list',{...params}).then((res)=>{
	      const pagination = { ...this.state.pagination };
	      pagination.total =res.totalCount;
	      pagination.current = res.currPage;
	      pagination.pageSize = res.pageSize;
	      this.setState({dataSource:res.list,loading:false,pagination})
	    }).catch(function(error){
	      console.log(error);
	    })
  	}
	render(){
		const columns = [
			{
				title:'ID',
				dataIndex:'id',
				key:'id'
			},{
				title:'名称',
				dataIndex:'itemsName',
				key:'itemsName'
			},{
				title:'仓库类型',
				dataIndex:'warehousType',
				key:'warehousType',
				render:(text,record,index)=>{
					if(text==1){
						return '训练装备'
					}else if(text==2){
						return '厨房'
					}else if(text==3){
						return '药品'
					}else if(text==4){
						return '犬粮'
					}else{
						return text
					}
				}
			},{
				title:'库存',
				dataIndex:'stockCount',
				key:'stockCount',
			},{
				title:'借出',
				dataIndex:'loanCount',
				key:'loanCount',
			},{
				title:'备注',
				dataIndex:'remark',
				key:'remark',
			}
		];
		return(
			<div>			
				<Table  loading={this.state.loading}  
						columns={columns} 
						dataSource={this.state.dataSource}
						bordered 
						pagination={this.state.pagination}
						rowKey='id'
						onChange={this.handleTableChange} />
			</div>
		)
	}
}
export default DeviceInforTable;


// WEBPACK FOOTER //
// ./src/components/view/tables/DeviceInforTable.js