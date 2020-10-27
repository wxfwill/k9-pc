import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message,Tag,Card,Collapse,Row,Col,Select,DatePicker,Form,Input,Tooltip } from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import { firstLayout,secondLayout} from 'components/view/common/Layout';
import PeoModal from '../../view/monitoring/Deploy/add/PeoModal';
import moment from 'moment';
import 'style/view/common/detailTable.less';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;

class AddGropSchedule extends Component {
    constructor(props) {
        super(props);
        let groupId='';
        let groupName='';
        if(this.props.location.query&&this.props.location.query.editItem) {
            groupId=this.props.location.query.editItem.groupId;
            groupName=this.props.location.query.editItem.groupName;
         }
        this.state = {
            disabled: false,
            typeOption: [],
            places: [],
            groups: [],
            groupId:groupId,
            groupName: groupName,
            peoValue: this.mapGroups(),
            targetKeys: this.mapGroups('id'),
        }
    }
    componentDidMount(){
   //     this.searchPeople();
    }

    disabledDate=(current)=>{
	    return current && current < moment().endOf('day');
    }	
    handleSubmit=() => {
        let id;
        if(this.props.location.query&&this.props.location.query.editItem) {
            id = `${this.props.location.query.editItem.groupId}`;
        }
        this.props.form.validateFields((err,values)=> {
            if(!err) {
                console.log(values);
                const params = {
                    ...values,
                    userIds: this.state.targetKeys
                }
                if(id) {
                    params.groupId = id
                }
                httpAjax('post',config.apiUrl+'/api/onDuty/saveGroupUser', params).then((res) => {
                    if(res.code == 0) {
                        this.props.history.push('/app/duty/groupInfo');
                        message.info('保存成功！')
                    } else {
                        message.error('保存失败！')
                    }
                 })
            }
        })
    }
    searchPeople = (name="") => {
        httpAjax('post',config.apiUrl+'/api/basicData/dutyGroup',{name}).then(res => {
            if(res.code == 0) {
                this.setState({groups: res.data})
            }
           
        })
    }
    addPeople() {
        this.setState({ peoVisible: true });
    }
    handleCancel = (e) => {
    this.setState({
        orgVisible: false,
        peoVisible: false,
        changeLeft: false
    });
    }
    handleAdd(peopleMsg) {
        let values = [];
        let targetKeys = [];
        peopleMsg.forEach((item, index) => {
          values.push(item.name);
          targetKeys.push(item.key);
        })
        this.props.form.setFieldsValue({
            dutyUserVOList: values.join(',')
        });
        this.setState({
          peoValue: values.join(','),
          targetKeys: targetKeys
        })
        this.setState({ peoVisible: false });
      }
      mapGroups = (type) => {
        if(this.props.location.query&&this.props.location.query.editItem) {
           const editItem = this.props.location.query.editItem;
            const peos = editItem.dutyUserVOList.map((t) => t.name);
            const ids = editItem.dutyUserVOList.map((t) => t.id);
            return type=='id'?ids:peos.join(',');
        }
        return type=='id'?[]:'';
    }
    render() {
        console.log(this.state)
        const {disabled, typeOption, places, groups} = this.state;
        const { getFieldDecorator  } = this.props.form;
        let editItem;
        if(this.props.location.query) {
            editItem = this.props.location.query.editItem;
        }
        return(
            <Row gutter={24}>
		            <Col span={24}>
			          	<Card title='创建分组' bordered={true}>
			          		<Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
			          			<Form className="ant-advanced-search-form">
							      <Row gutter={24}>
                                        <Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='组名' {...firstLayout}  >
                                                {getFieldDecorator('groupName',{
                                                rules: [{ required: true, message: '请输入组名' }],
                                                initialValue:this.state.groupName?this.state.groupName:""
                                                })(
                                                    <Input placeholder="请输入组名" disabled={true} autosize={{ minRows: 2, maxRows: 24 }} />
                                                )}
                                            </FormItem>
							            </Col>     
                                    </Row>
    
                                    </Row>			            						            				                    					            						            						            						            						            						            						            						            						            						            	
                                    <Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='组员' {...firstLayout}  >
                                                {getFieldDecorator('userIds',{
                                                rules: [{ required: true, message: '请选择组员' }],
                                                initialValue:this.state.peoValue || ""
                                                })(
                                                    <Tooltip
                                                        trigger={['hover']}
                                                        title={this.state.peoValue}
                                                        placement="topLeft"
                                                        overlayClassName="numeric-input"
                                                    >
                                                    <Input placeholder="请选择组员" value={this.state.peoValue} disabled={true} addonBefore={<Icon type="plus" style={{ cursor: 'pointer' }} onClick={this.addPeople.bind(this)} />} />
                                                    </Tooltip>
                                                )}
                                            </FormItem>
							            </Col>     
                                    </Row>
                                    <Row>
                                        <Col span={24} style={{ textAlign: 'center',marginTop:'40px' }}>
                                        <Button type="primary" htmlType='submit' onClick={() => this.handleSubmit()}>保存</Button>
                                        {/* <Button style={{ marginLeft: 8 }} onClick={() => this.handleSubmit('save')}>保存</Button> */}
                                        </Col>
                                    </Row> 
				                    
								</Form>
			          		</Col>		
			          	</Card>
		            </Col>
                    {this.state.peoVisible ? <PeoModal
                    visible={this.state.peoVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleAdd.bind(this)}
                    targetKeys={this.state.targetKeys}
                    /> : null}
	        	</Row>)
    }
}

export default Form.create()(AddGropSchedule);


// WEBPACK FOOTER //
// ./src/components/admin/scheduleManage/AddGropSchedule.js