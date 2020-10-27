import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form ,Select,message,Badge} from 'antd';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable'
//import EditableCell from './EditableCell'


const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  getSelect=()=>{
    return    <Select defaultValue="0" style={{ width: 80 }} >
                    <Option value="0">时长</Option>
                    <Option value="1">次数</Option>
                </Select>;
  }
  getSelectOperate=()=>{
    return   <Select defaultValue="0" style={{ width: 70 }} >
                    <Option value="0">{`>=`}</Option>
                    <Option value="1">{`<`}</Option>
                </Select>;
  }
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                dataIndex=='subjectName' || dataIndex=='item' || (record.performanceId==1 ||record.performanceId==2 ||record.performanceId==5 )&&dataIndex=='optScore' ||(record.performanceId==3 ||record.performanceId==4 )&&dataIndex=='basisScore' ? record[dataIndex] :
               ( 
                dataIndex=='rule' ?
               <div style={{display: '-webkit-inline-box'}}> <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator('type', {
                    rules: [{
                      required: true,
                      message: `请输入类型!`,
                    }],
                    initialValue: record['type'].toString(),
                  })(this.getSelect())}
                </FormItem>
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator('operate', {
                    rules: [{
                      required: true,
                      message: `请输入比较方式!`,
                    }],
                    initialValue:  record['operate'].toString(),
                  })(this.getSelectOperate())}
                </FormItem>
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator('value', {
                    rules: [{
                      required: true,
                      message: `请输入具体对比数据!`,
                    }],
                    initialValue: record['value'],
                  })(this.getInput())}
                </FormItem></div> :
                   <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>)
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
class EditableTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        pagination: {
	        showSizeChanger:true,
	        showQuickJumper :true,
	        defaultCurrent:1
          },
          current: '',
	      pageSize:5,
	      currPage:1,
	      dataSource:[],
           editingKey: '' 
        };
      this.columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
             render:id=>{
                return <Badge overflowCount={10000} count={id} style={{minWidth: '50px',fontSize:'12px',height:'16px',lineHeight:'16px', backgroundColor: '#99a9bf' }} /> 
            }
            },
        {
          title: '科目',
          dataIndex: 'subjectName',
          key:'subjectName',
          width: '20%',
          editable: true,
        },
        {
          title: '指标',
          dataIndex: 'item',
          key:'item',
          width: '15%',
          editable: true,
        },
        {
          title: '基础分',
          dataIndex: 'basisScore',
          key:'basisScore',
          width: '15%',
          editable: true,
        }
        ,
        {
          title: '分值',
          dataIndex: 'optScore',
          key:'optScore',
          width: '15%',
          editable: true,
        }
        ,
        {
          title: '得分规则',
          dataIndex: 'rule',
          width: '20%',
          key:'rule',
          editable: true,
        },
        {
          title: '操作',
          width: '15%',
          key:'operation',
          dataIndex: 'operation',
          render: (text, record) => {
            const editable = this.isEditing(record);
            return (
              <div>
                {editable ? (
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <a
                          href="javascript:;"
                          onClick={() => this.save(form, record.key)}
                          style={{ marginRight: 8 }}
                        >
                          保存
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <Popconfirm
                      title="确定取消？"
                      onConfirm={() => this.cancel(record.key)}
                    >
                      <a>取消</a>
                    </Popconfirm>
                  </span>
                ) : (
                  <a onClick={() => this.edit(record.key)}>编辑</a>
                )}
              </div>
            );
          },
        },
      ];
    }
 
    componentDidMount(){
        this.fetch({pageSize:5, currPage:1,id:this.props.performanceId?this.props.performanceId:1});
    }
    componentWillMount() {
    	this.fetch({pageSize:5, currPage:1,id:1});
      }
    componentWillReceiveProps(nextProps) {
        if(this.props.performanceId==nextProps.performanceId) {
            return
        }
        let filter = nextProps.filter;
        let _this = this;
        this.setState({filter:filter},function(){
            _this.fetch({pageSize:5, currPage:1,id:this.props.performanceId?this.props.performanceId:1});
        })
    }
  	fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
	    this.setState({ loading: true });
	    httpAjax('post',config.apiUrl+'/api/performanceCheck/listSubjectItemByTypeId',{...params}).then((res)=>{
	      const pagination = { ...this.state.pagination };
	      pagination.total =res.totalCount;
	      pagination.current = res.currPage;
          pagination.pageSize = res.pageSize;
          let data=[];
          let performanceId=this.props.performanceId?this.props.performanceId:1;
          res.data.map((obj)=>{
            console.log(obj.id);
            obj.performanceCheckItemVOList.map((item)=>{
                let newItem=item;
                newItem['subjectName']=obj.subjectName;
                newItem['subjectId']=obj.id;
                newItem['performanceId']=performanceId;
                newItem['key']=item.id.toString();
                data.push(newItem);
            })
          })
          console.log(data);
	      this.setState({dataSource:data,loading:false,pagination})
	    }).catch(function(error){
	      console.log(error);
	    })
  	}
    isEditing = (record) => {
      return record.key === this.state.editingKey;
    };
  
    edit(key) {
      this.setState({ editingKey: key });
    }
  
    save(form, key) {
      form.validateFields((error, row) => {
        if (error) {
          return;
        }
        row.id=key;
        httpAjax('post',config.apiUrl+'/api/performanceCheck/updatePerformanceCheckItem',{...row}).then((res)=>{
            const newData = [...this.state.dataSource];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
              const item = newData[index];
              row.rule=(row.type==0 ? '时长':'次数')+(row.operate ==0 ? '>=':'<')+row.value;
              newData.splice(index, 1, {
                ...item,
                ...row,
              });
              this.setState({ dataSource: newData, editingKey: '' });
            } else {
              newData.push(this.state.dataSource);
              this.setState({ dataSource: newData, editingKey: '' });
            }
            message.success("保存成功！");
          }).catch(function(error){
            console.log(error);
          })
    
      });
    }
  
    cancel = () => {
      this.setState({ editingKey: '' });
    };
  
    render() {
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      };
  
      const columns = this.columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.dataIndex === 'optScore' || col.dataIndex === 'basisScore' || col.dataIndex === 'rule' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
          }),
        };
      });
  
      return (
        <Table
          key='performance'
          components={components}
          loading={this.state.loading} 
          pagination={false}
          bordered
          dataSource={this.state.dataSource}
          columns={columns}
          rowClassName="editable-row"
        />
      );
    }
  }

export default EditableTable;