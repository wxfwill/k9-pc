import React from 'react';
import { Table, Input, Icon, Button, Popconfirm,Modal  } from 'antd';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable'
import moment from 'moment';


class SubjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.DogTrainColumns = [{
      title: '姓名',
      dataIndex: 'trainerName',
      key:'trainerName',
   
    }, {
      title: '警犬',
      dataIndex: 'dogName',
      key:'dogName',
    }, {
      title: '指标名称',
      dataIndex: 'trainerName',
      key:'trainerName',
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key:'startTime',
      render:(text,record,index)=>{
        return <span>{record.startTime?moment(record.startTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
      }
    }, {
        title: '结束时间',
        dataIndex: 'endTime',
        key:'endTime',
        render:(text,record,index)=>{
            return <span>{record.endTime?moment(record.endTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
          }
      }
      , {
        title: '地点',
        dataIndex: 'trainPlace',
        key:'trainPlace',
      }
      
      ];
      this.DogUseColumns = [{
        title: '姓名',
        dataIndex: 'userName',
        key:'userName',
     
      }, {
        title: '指标名称',
        dataIndex: 'itemName',
        key:'itemName',
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        key:'taskName',
      }
      , {
        title: '警犬',
        dataIndex: 'dogName',
        key:'dogName',
      }, {
        title: '开始时间',
        dataIndex: 'startTime',
        key:'startTime',
        render:(text,record,index)=>{
            return <span>{record.startTime?moment(record.startTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
          }
      }, {
          title: '结束时间',
          dataIndex: 'endTime',
          key:'endTime',
          render:(text,record,index)=>{
            return <span>{record.endTime?moment(record.endTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
          }
        }
        , {
          title: '地点',
          dataIndex: 'location',
          key:'location',
        }
        
        ];
    this.LeaveColumns = [{
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '训导员',
        dataIndex: 'userName',
        key: 'userName',
      }, {
        title: '请假开始时间',
        dataIndex: 'leaveStartTime',
        key: 'leaveStartTime',
        render:(text,record,index)=>{
            return <span>{record.leaveStartTime?moment(record.leaveStartTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
          }
      }, {
        title: '请假结束时间',
        dataIndex: 'leaveEndTime',
        key: 'leaveEndTime',
        render:(text,record,index)=>{
            return <span>{record.leaveEndTime?moment(record.leaveEndTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
          }
      }, {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
        render:(text,record,index)=>{
            return <span>{record.applyTime?moment(record.applyTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
          }
      }, {
        title: '请假天数',
        dataIndex: 'duration',
        key: 'duration',
      }, {
        title: '请假类型',
        dataIndex: 'typeName',
        key: 'typeName',
      }
        ];
    this.wColumns = [
      {
         title:'记录时间',
         dataIndex:'recordTime',
         key:'recordTime',
         render:(text,record,index)=>{
          return <span>{record.recordTime?moment(record.recordTime).format("YYYY-MM-DD"):'--'}</span>
        }
       },
       {
         title:'来源',
         dataIndex:'source',
         key:'source'        
       },
       {
         title:'类型',
         dataIndex:'type',
         key:'type',
         render:(text,record,index)=>{
           let typeVal='';
           switch (text) {
             case 1:
               typeVal='刑事案件';
               break;
             case 2:
               typeVal='搜爆安检';
               break;
             case 3:
               typeVal='日常事务';
               break;
             case 4:
               typeVal='会议';
               break;
             case 5:
               typeVal='领导交办';
               break;
             case 6:
               typeVal='日常诊疗';
               break;
             default:
               typeVal='';
               break;
           }
           return typeVal;
         }       
       },
       {
         title:'部门',
         dataIndex:'groupName',
         key:'groupName'        
       }, {
         title:'汇报人',
         dataIndex:'reportUserName',
         key:'reportUserName'        
       }, {
         title:'记录人',
         dataIndex:'recordUserName',
         key:'recordUserName'        
       }, {
        title:'执行人',
        dataIndex:'userVOS',
        key:'userVOS',
        render:(text,record,index)=>{
          const peoValue = record.userVOS.map((t) => t.name);
          return <span>{peoValue.join(',')}</span>
        }       
      },
       {
        title:'执行时间',
        dataIndex:'recordTime',
        key:'recordTime',
        render:(text,record,index)=>{
         return <span>{record.taskTime?moment(record.taskTime).format("YYYY-MM-DD"):'--'}</span>
       }
      },{
         title:'执行任务情况',
         dataIndex:'taskDesc',
         key:'taskDesc'        
       },];
  
    this.state = {
      dataSource: [],
      count: 2,
      pageSize:10,
      currPage:1,
      checkDate:'',
      subjectInfo:'',
      scroll: 'enable',
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
    };
  }
  componentWillUnmount(){
    this.setState({
      dataSource:[]
    })
}
  
  componentWillReceiveProps(nextProps){
        this.setState({
            subjectInfo:nextProps.subjectInfo,
            checkDate:nextProps.checkDate,
            nextProps
        })
        const {pageSize,currPage} = this.state;
        this.getDataSource(nextProps,pageSize,currPage);
  }
 
  getDataSource(nextProps,pageSize,currPage){
   
    const {subjectInfo,checkDate} = nextProps;
    console.log(subjectInfo,'subjectInfo');
    let action = '/api/performanceCheck/getDogTrainInfoById';
    let columns=this.DogTrainColumns;
    if(subjectInfo.typeId==3){
        action = '/api/command4w/queryDetail';
        columns = this.DogUseColumns
    }else if(subjectInfo.typeId==5){
        action = '/api/performanceCheck/getLeaveById';
        columns = this.LeaveColumns;
    }
  //  const {pageSize,currPage} = this.state;
  if(!subjectInfo.id){
    return;
  }
  this.setState({
    dataSource:[]
  })
  let data={ 
        "id":subjectInfo.id ? subjectInfo.id :0,
    };
  if(subjectInfo.is4w==1){
    data={ 
        "id":subjectInfo.dataId ? subjectInfo.dataId :0,
    };
    columns = this.wColumns;
  }
    httpAjax('post',config.apiUrl+action,
    data
    ).then((res)=>{
        const pagination = { ...this.state.pagination };
        pagination.total =res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        let data = [];
        if(subjectInfo.is4w==1){
            data.push(res.data);
        }else{
          data = res.data;
        }
        this.setState({
            dataSource:data,
            pagination,
            columns:columns
        })
    
    }).catch(function(error){
       console.log(error);
    })
  }
  handleTableChange=(pagination, filters, sorter)=>{
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      pageSize: pagination.pageSize,
      currPage: pagination.current
    });
    this.getDataSource(this.state.nextProps,pagination.pageSize,pagination.current);
  }
  
  render() {
    const { dataSource ,pagination,columns,enable} = this.state;
    const {isSubjectDetail,hideModal,subjectInfo} = this.props;
    const title = subjectInfo.subjectName+'——详细信息';
    return (
      <div>
       <Modal
              title={title}
              visible={isSubjectDetail}
              onOk={hideModal}
              onCancel={hideModal}
              maskClosable={false}
              width={800}
              footer={[
                    <Button key="back" type="primary"  onClick={hideModal}>
                        确定
                    </Button>,
                ]}
            >
          
          <Table bordered dataSource={dataSource} columns={columns} scroll={enable} pagination={false}   onChange={this.handleTableChange}  />
          
        </Modal>
       
      </div>
    );
  }
}

export default SubjectDetail;


// WEBPACK FOOTER //
// ./src/components/admin/performance/Register/SubjectDetail.js