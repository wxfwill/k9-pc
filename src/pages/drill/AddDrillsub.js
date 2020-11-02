import React,{ Component } from 'react';
import { Button,Icon,message,Card,Collapse,Row,Col,Select,Form,Input,Upload } from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import { firstLayout,secondLayout} from 'util/Layout';

import moment from 'moment';
import 'style/view/common/detailTable.less';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;

class AddDrillsub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            typeOption: [],
            trainLevel: [{id:1,name:'初'},{id:2,name:'中'},{id:3,name:'高'}],
            places: [],
            fileList: '',
            upfile: '',
            peoples: [],
            id: '',
            isLocal: false,
            editItem: '',
            isDelete: 0,
        }
    }
    componentDidMount(){
        //const typeOption = httpAjax('post',config.apiUrl+'/api/trainingSubject/getAllTrainType');
        //const trainPlace = httpAjax('post', config.apiUrl+'/api/basicData/trainPlace');
        // /api/userCenter/getTrainer
        //const Trainers = httpAjax('post', config.apiUrl+'/api/userCenter/getTrainer',{name:''});
        const pathname = this.props.location.pathname;
        if(this.props.location.query && this.props.location.query.id){
            let id = this.props.location.query.id;
            this.setState({
                id: id
            })
            this.getDatail(id)
        }

        if(pathname.indexOf('Detail')>-1) {
            this.setState({ disabled: true})
        } else {
             this.setState({ disabled: false})
        }
        //Promise.all([typeOption, trainPlace, Trainers]).then(resArr => {
        /*Promise.all([typeOption]).then(resArr => {
            let disabledVal=false;
            this.setState({
                typeOption: resArr[0].data,
                //places: resArr[1].data,
                //peoples: resArr[2].data,
          //      disabled:disabledVal
            })
        })*/
    }
    disabledDate=(current)=>{
	    return current && current < moment().endOf('day');
    }	
    handleSubmit=(type) => {
        let subjectFile = this.state.upfile;
        let id = '';
        this.setState({
            disabled: true
        })
        
        const url ='/api/trainingSubject/saveInfo';
        this.props.form.validateFields((err,values)=> {
            if(!err) {
                this.state.id ? values.id = this.state.id : '';
                values.subjectFile = subjectFile ? subjectFile : '';
                values.isDelete = this.state.isDelete;
                let params = new FormData()  // 创建form对象
                Object.keys(values).forEach((item, index) => {
                    if ((values[item] != undefined) || (values[item] != '') || (options[item] != null)) {
                        params.append(item, values[item]);
                    }
                })
                if(id) {
                    params.append('id', id);
                    //params.id = id
                }
                httpAjax('post',config.apiUrl+url, params).then((res) => {
                    if(res.code == 0) {
                        this.props.history.push('/view/drill/drillsub');
                    } else {

                    }
                })
            }else{
                this.setState({
                    disabled: false
                })
            }
        })
    }
    getDatail(params){
        httpAjax('post',config.apiUrl+'/api/trainingSubject/getTrainingSubjectById',{id:params}).then((res)=>{
            console.log(res)
            let fileList = '';
            let upfile = '';
            if(res.data.trainContent){
                fileList = [{
                    uid: -1,
                    name: '图片',
                    status: 'done',
                    url: `/api/trainingSubject/img?trainContent=`+res.data.trainContent,
                }]
            }
            this.setState({
                fileList: fileList,
                editItem:res.data,
            })
        }).catch(function(error){
          console.log(error);
        })
    }
    onRemove(file){
        console.log(file)
        this.setState({
            isDelete: 1,
            upfile: '',
            fileList: '',//fileList,
            previewImage: ''//file.url || file.thumbUrl,
        });
    }
    beforeUpload(file) {
        //const {file, fileList} = data;
        console.log(file)
        
        this.setState({ lastestUploadImg: ''})
        let _this = this;
        let url = window.URL.createObjectURL(file);
        console.log(url)
        const isLt2M = file.size / 1024 / 1024 < 2;
        console.log(isLt2M)
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false;
        }
        if (isLt2M) {
            this.setState({
                isDelete: 0,
                upfile: file,
                fileList: [Object.assign({}, file, {originFileObj: file})],//fileList,
                previewImage: url//file.url || file.thumbUrl,
            });
        }
        let promise = new Promise(function (resolve, reject) {
            if (isLt2M) {
                // resolve(_this.state.fileList);
            } else {
                reject(error);
            }
        });
        return promise;
    }
    render() {
        //const {disabled, typeOption, places, peoples, trainLevel, fileList} = this.state;
        const {disabled, trainLevel, fileList, editItem} = this.state;
        console.log(this.props.form)
        const { getFieldDecorator  } = this.props.form;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        return(
            <Row gutter={24}>
		            <Col span={24}>
			          	<Card title='训练科目' bordered={true}>
			          		<Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
			          			<Form className="ant-advanced-search-form">
							      	<Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='训练项目名称：' {...secondLayout}  >
                                               {getFieldDecorator('trainSubjectName',{
                                                rules: [{ required: true, message: '请选择训犬人员' }],
                                                initialValue:editItem? editItem.trainSubjectName:[]
                                               })(
                                                  <Input placeholder="请输入训练项目名称" disabled={disabled} />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                           <FormItem label='训练阶段' {...secondLayout}  >
                                               {getFieldDecorator('trainLevel',{
                                                    rules:[{required:true,message:'请选择训练阶段'}],
                                                    initialValue:editItem?editItem.trainLevel:""
                                                })(
                                                    <Select disabled={disabled}>
                                                        {trainLevel.map((item) => <Option value={item.id} key={item.id+'trainLevel'}>{item.name}</Option>)}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
					            	</Row>
							      	<Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                           <FormItem label='训练目标' {...secondLayout}  >
                                               {getFieldDecorator('trainTarget',{
                                                rules: [{ required: true, message: '请选择训练场地' }],
                                                initialValue:editItem?editItem.trainTarget:""
                                               })(
                                                  <Input placeholder="请输入训练目标" disabled={disabled} />
                                                )}
                                            </FormItem>
                                        </Col>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='训练动作规范' {...secondLayout}  >
                                                {getFieldDecorator('trainStandard',{
                                                rules: [{ required: true, message: '请输入训练动作规范' }],
                                                initialValue:editItem?editItem.trainStandard:""
                                                })(
                                                    <Input placeholder="请输入训练动作规范" disabled={disabled} />
                                                )}
                                            </FormItem>
                                        </Col>     
					            	</Row>					            						            				                    					            						            						            						            						            						            						            						            						            						            	
                                    <Row gutter={24}>
                                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                            <FormItem label='训练内容' {...firstLayout}  >
                                                {/*<Upload
                                                    name="subjectFile"
                                                    action={config.apiUrl + '/api/dog/saveInfo'}
                                                    disabled={disabled}
                                                    accept="image/*"
                                                    listType="picture-card"
                                                    onChange={data => console.log(data)}
                                                    beforeUpload={this.beforeUpload.bind(this)} >
                                                    {editItem ? '' : uploadButton
                                                    }
                                                </Upload>*/}
                                                {getFieldDecorator('subjectFile',{
                                                    rules: [{ required: false, message: '请上传训练图片' }],
                                                    initialValue:editItem?editItem.subjectFile:""
                                                })(
                                                    <Upload
                                                      name="subjectFile"
                                                      action={config.apiUrl + '/api/trainingSubject/saveInfo'}
                                                      disabled={disabled}
                                                      fileList={fileList}
                                                      listType="picture-card"
                                                      accept="image/gif, image/jpeg, image/jpg, image/png, image/GIF, image/JPEG, image/JPG, image/PNG"
                                                      onRemove={this.onRemove.bind(this)}
                                                      beforeUpload={this.beforeUpload.bind(this)}
                                                    >
                                                      {fileList.length >= 1 ? null : uploadButton}
                                                    </Upload>
                                                )}
                                                
                                            </FormItem>
                                        </Col>     
                                    </Row>
                                    {
                                       !disabled ?
                                    <Row>
                                        <Col span={24} style={{ textAlign: 'center',marginTop:'40px' }}>
                                        <Button style={{ marginLeft: 8 }} onClick={() => this.handleSubmit('save')}>保存</Button>
                                        </Col>
                                    </Row> :null
                                    }
								</Form>
			          		</Col>		
			          	</Card>
		            </Col>
	        	</Row>)
    }
}

export default Form.create()(AddDrillsub);


// WEBPACK FOOTER //
// ./src/components/view/drill/AddDrillsub.js