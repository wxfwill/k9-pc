import React ,{ Component } from 'react';
import { Table,Modal,Button,Carousel ,Upload,Form} from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';
import moment from 'moment';
//import WorkLogDetail from './WorkLogDetail';
//const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');
class WorkLogForm extends React.Component {
  constructor(props){
    super(props);
    this.state={
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
      pageSize:10,
      currPage:1,
      data:[],
      visible: false,
      filter:null,
      loading:false,
   /*   queryId:'',
      changeLeft:false,
      showDetail:false,
      statisticsTime:''*/
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
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...this.state.filter
    });
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/taskReport/workInfoLog',{...params}).then((res)=>{
      const pagination = { ...this.state.pagination };
      pagination.total =res.data.totalCount;
      pagination.current = res.data.currPage;
      pagination.pageSize = res.data.pageSize;
      this.setState({data:res.data.list,loading:false,pagination,fileList:[],})
    }).catch(function(error){
      console.log(error);
    })
  }
 /* queryDetail=(data,statisticsTime)=>{
    this.setState({
      queryId:data,
      showDetail:true,
      changeLeft:true,
      statisticsTime
    })
  }
  handleShow(){
    let _this = this;
    this.setState({
      changeLeft:false
    },function(){
      setTimeout(()=>{
        _this.setState({
          showDetail:false
        })
      },600)
    })
  }*/
  getColumns(){
    let _this = this;
    const columns = [
      {
        title: '序号',
        dataIndex: 'seq',
        width:"8%",
        key: 'seq'
      },
      {
      title: '日期',
      dataIndex: 'opDate',
      width:"8%",
      key: 'opDate',
      render:(opDate,record,index)=>{
        return <span>{opDate?moment(opDate).format("YYYY/MM/DD"):'--'}</span>
      }
    },{
        title: '时间',
        dataIndex: 'opTime',
        width:"8%",
        key: 'opTime'
      }, {
        title: '来源',
        dataIndex: 'origin',
        width:"8%",
        key: 'origin',        
      },
      {
        title: '类别',
        dataIndex: 'type',
        width:"8%",
        key: 'type',        
      },
      {
        title: '部门',
        dataIndex: 'department',
        width:"8%",
        key: 'department',        
      },
      {
        title: '汇报人',
        dataIndex: 'reporter',
        width:"8%",
        key: 'reporter',        
      },
      {
        title: '记录人',
        dataIndex: 'recorder',
        width:"8%",
        key: 'recorder',        
      },
      {
        title: '汇报内容',
        dataIndex: 'content',
        width:"8%",
        key: 'content',    
        render:(content,record,index)=>{ 
          return  <span  onClick={_this.showPhoto.bind(this,content)} style={{cursor: "pointer",height:'30px',width:'30px',marginRight:'8px'}}>{content.substr(0,10)}{content.length>10 ? '...':''}</span>
        }    
      },
      {
        title: '是否反馈',
        dataIndex: 'isFeedback',
        width:"8%",
        key: 'isFeedback',        
      },
      {
        title: '反馈',
        dataIndex: 'feedback',
        width:"8%",
        key: 'feedback',        
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width:"8%",
        key: 'remark',
       
      }];
    return columns;
  }
  showPhoto=(content)=>{
    this.setState({
      content
    })
    this.showModal();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  importReport = (file) =>{
    let param = new FormData(),
    _this = this,
    configs = { headers: { 'Content-Type': 'multipart/form-data' } };
    param.append('file',file.pop());
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/taskReport/importReport',param,configs).then((res)=>{
      
      if(res.code==0){
        this.fetch();
        Modal.success({
          title: '导入信息',
          content: res.data,
        });
      }else{
        Modal.info({
          title: '导入信息',
          content: res.data,
        });
      }
      this.setState({ loading: false });
    }).catch(function(error){
      console.log(error);
      _this.setState({ loading: false });
    })
  
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
  render() {
    const { match } = this.props;
    let {content,visible} = this.state;
    return (
      <div>
        <div style={{marginBottom:'20px'}}>
        {/*  <Button type='primary' style={{marginRight:'20px'}} onClick={this.addInfo}>
            <Link to={{pathname:'/app/holiday/holidayListAdd', query: {targetText:'新增' }}}>导入</Link>
          </Button>*/}
          <Form >
          <div className="hide-ant-upload-list">
            <Upload
                name="file"
                action={config.apiUrl + '/api/taskReport/importReport'}
                accept="file/*"
                onChange={(file) => {this.importReport([file.file]);}}
                beforeUpload={(file) => { return false}} >
                <Button type='primary'>
                 导入
                </Button> 
              </Upload>
            </div>
            </Form>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>*/}
        </div>
        <Table  loading={this.state.loading} columns={this.getColumns()} dataSource={this.state.data}  bordered pagination={this.state.pagination} onChange={this.handleTableChange}/>
        {/*this.state.showDetail?<WorkLogDetail handleShow={this.handleShow.bind(this)} queryId={this.state.queryId} statisticsTime={this.state.statisticsTime}changeLeft={this.state.changeLeft}/>:null*/}
        <Modal
          title="汇报内容详情"
          visible={visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          footer={[
            <Button key="submit" type="primary" onClick={this.hideModal}>
              确定
            </Button>,
          ]}
        >
         <Carousel autoplay >
         {content?
                   <div >{content}</div>
                  :<div >{'暂无汇报内容'}</div>
                  }
            
          </Carousel>
        </Modal>
      </div>
    );
  }
}
const WorkLogTable = Form.create()(WorkLogForm);
export default WorkLogTable;




// WEBPACK FOOTER //
// ./src/components/admin/reportManage/WorkLog/WorkLogTable.js