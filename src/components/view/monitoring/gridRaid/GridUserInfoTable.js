import React ,{ Component } from 'react';
import { Table, Button , Tag , Badge} from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
const localSVG = require('images/banglocation.svg');

const columns = [{
    title: '警号',
    dataIndex: 'number',
  }, {
    title: '姓名',
    dataIndex: 'name'
},{
    title:'区域编号',
    dataIndex:'index'
}];

class GridUserInfoTable extends React.Component {
  constructor(props){
    super(props);

    this.state= {
        selectPeoples: [],
        gridUserInfo: [], //网格区域人员信息列表
        selectedRows: [],
    }
  }
  componentWillReceiveProps(nextProps) { //已选择人员区域合并展示处理
    const {selectPeoples} = nextProps;
    let filter_selectPeoples = [], hasSeledObj={};
    selectPeoples.forEach((item) => {
      let hasSeled = false;
      if(!hasSeledObj[item.number]){
        hasSeledObj[item.number] = [item.index];
      }else{
        hasSeled = true;
        hasSeledObj[item.number].push(item.index);
      }
      let newItem = {...item};
      if(!hasSeled){
        filter_selectPeoples.push(newItem);
      }
    });
    filter_selectPeoples.forEach(nItem => {
      nItem.index = (hasSeledObj[nItem.number].sort()).join(',');
    })
    this.setState({selectPeoples: filter_selectPeoples});
  }

  addUser(ua){ //添加用户
    this.state.gridUserInfo.push(ua);
    this.setState({gridUserInfo:this.state.gridUserInfo});
  }

  render() {

    const {isCheck} = this.props;
    const {selectPeoples} = this.state;
    const rowSelection = {
      onSelect: (record, selected, selectedRows) => {
        this.setState({selectedRows});
        const status = selectedRows.length > 0 ? true : false;
        this.props.contralDeleteBtn(status)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.setState({selectedRows})
        const status = selectedRows.length > 0 ? true : false;
        this.props.contralDeleteBtn(status)
      }
    };
    return isCheck?(
      <div>
          <Table columns={columns} rowKey={(record)=>{ return 'key_'+record.id+'_'+record.index}} rowSelection={rowSelection} dataSource={selectPeoples} size="small" pagination={false}/>
      </div>
    ):(
      <div>
          <Table columns={columns} dataSource={selectPeoples} size="small" pagination={false}/>
      </div>
    );
  }
}
export default GridUserInfoTable;




// WEBPACK FOOTER //
// ./src/components/view/monitoring/GridRaid/GridUserInfoTable.js