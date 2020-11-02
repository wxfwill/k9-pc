import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload, message } from 'antd';
import { firstLayout, secondLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
require('style/app/dogInfo/addDogForm.less');
class FormCompomnent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dogId: '',
      disabled: false,
      isInitialValue: true,
      dogInfor: '',
      vaccineType: [],
    };
  }
  componentWillMount() {
    //获取疫苗种类
    httpAjax('post', config.apiUrl + '/api/basicData/vaccineType', {}).then((res) => {
      if (res.code == 0) {
        this.setState({ vaccineType: res.data });
      }
    });
    const formStatus = sessionStorage.getItem('formStatus'); //this.props.location.query&&this.props.location.query.targetText;
    // const dogId=sessionStorage.getItem("dogId");
    const vaccineType = JSON.parse(sessionStorage.getItem('vaccineType'));
    this.setState({ vaccineType });
    if (formStatus == 'view') {
      this.setState({ disabled: true, isInitialValue: true });
    } else if (formStatus == 'edit') {
      this.setState({ isInitialValue: true });
    } else if (formStatus == 'add') {
      this.setState({ isInitialValue: false });
    }
    //根据id获取单个犬只数据
    // if(dogId){
    // 	httpAjax('post',config.apiUrl+'/api/vaccineRecord/info',{dogId:dogId}).then(res=>{
    // 		if(res.code==0){
    // 			this.setState({dogInfor:res.data&&res.data.dogInfor});
    // 		}
    // 	})
    // }
  }
  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  handleSubmit = (e) => {
    e.preventDefault();
    // const { dogId ,dogInfor}=this.state;
    const { id } = JSON.parse(sessionStorage.getItem('user'));
    const formStatus = sessionStorage.getItem('formStatus');
    const successMess = formStatus == 'edit' ? '修改成功' : '添加成功';
    const errorMess = formStatus == 'edit' ? '修改失败' : '添加失败';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // const options = values;
        // let param = new FormData()  // 创建form对象
        // if(options.vaccineTime){
        // 	options.vaccineTime = moment(new Date(values.vaccineTime)).format('YYYY-MM-DD');
        // }
        // if(options.nextVaccineRemindingTime){
        // 	options.nextVaccineRemindingTime = moment(new Date(values.nextVaccineRemindingTime)).format('YYYY-MM-DD');
        // }
        // Object.keys(options).forEach((item,index)=>{
        // 	if(options[item]!=undefined){
        // 		param.append(item,options[item]);
        // 	}
        // })
        // let configs = {
        // 	headers: {'Content-Type': 'application/json'}
        // }
        // if(dogId){
        // 	param.append("ids",dogId);
        // }
        //  param.append("userId",id);

        const params = {
          name: values.name,
          planDate: values.planDate.format('x'),
          vaccineType: values.vaccineType.join(','),
        };
        if (this.props.location.query) {
          params.id = this.props.location.query.record.id;
        }
        httpAjax('post', config.apiUrl + '/api/vaccineRecord/savePlan', params)
          .then((res) => {
            if (res.code == 0) {
              message.success(successMess);
              this.props.history.push('/app/dog/prevention');
            } else {
              message.error(errorMess);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  selectChange = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled, isInitialValue, dogInfor, vaccineType } = this.state;
    // console.log(this.state);
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const vaccineOption =
      vaccineType &&
      vaccineType.map((item, index) => {
        return (
          <Option value={`${item.id}`} key={index}>
            {item.name}
          </Option>
        );
      });
    let name = '',
      planDate = '',
      vaccineTypename = '';
    if (this.props.location.query) {
      name = this.props.location.query.record.name;
      planDate = this.props.location.query.record.planDate;
      vaccineTypename = this.props.location.query.record.vaccineType;
    }

    return (
      <div className="AddDogForm">
        <Row gutter={24}>
          <Col span={24}>
            <Card title="犬病防治" bordered={true}>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="计划名称" {...secondLayout}>
                        {getFieldDecorator('name', {
                          rules: [
                            { required: true, message: '请填写计划名称' },
                            { max: 50, message: '计划名称长度不超过50' },
                          ],
                          initialValue: isInitialValue ? name : '',
                        })(<Input />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="药物名称" {...secondLayout}>
                        {getFieldDecorator('vaccineType', {
                          rules: [{ required: true, message: '请选择药物名称' }],
                          initialValue: isInitialValue ? vaccineTypename.split(',') : [],
                        })(
                          <Select disabled={disabled} mode="multiple">
                            {vaccineOption}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="计划时间" {...secondLayout}>
                        {getFieldDecorator('planDate', {
                          rules: [{ required: true, message: '请选择计划时间' }],
                          initialValue: isInitialValue ? moment(new Date(planDate)) : '',
                        })(<DatePicker format="YYYY-MM-DD" disabled={disabled} disabledDate={this.disabledDate} />)}
                      </FormItem>
                    </Col>
                    {/* <Col xl={12} lg={12} md={24} sm={24} xs={24}>
							              <FormItem label='下次注射时间' {...secondLayout} >
							               {getFieldDecorator('nextVaccineRemindingTime',{
							               	rules:[{required:true,message:'请选择下次注射疫苗时间'}],
							               	//initialValue:isInitialValue?dogInfor.name :""
							               })(
												<DatePicker  format="YYYY-MM-DD" disabled={disabled} disabledDate={this.disabledDate}/>
							                )}
							              </FormItem>
							            </Col> */}
                  </Row>
                  {!disabled ? (
                    <Row>
                      <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit.bind(this)}>
                          提交
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                          清空
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                </Form>
              </Col>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
const AddPreventionForm = Form.create()(FormCompomnent);

const mapStateToProps = (state) => ({
  loginState: state.login,
});
export default connect(mapStateToProps)(AddPreventionForm);

// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogPrevention/AddPreventionForm.js
