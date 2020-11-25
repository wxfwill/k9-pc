import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload, message, Modal } from 'antd';
import { firstLayout, secondLayout } from 'util/Layout';
import * as formData from './userData';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
require('style/app/dogInfo/addDogForm.less');

@connect(
  (state) => ({ dutyList: state.userReducer.dutyList, userInfo: state.loginReducer.userInfo })
  // (dispatch) => ({ changeNavData: (nav) => dispatch(changeNavName(nav)) })
)
class FormCompomnent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      imageUrl: '',
      userId: '',
      disabled: false,
      userInfor: '',
      previewVisible: false,
      previewImage: '',
      showImgUrl: '',
      name: undefined, // 姓名
      identityNo: undefined, // 身份证
      sex: null, // 性别
      birthday: null, // 出生日期
      nation: undefined, // 名族
      birthplace: undefined, // 籍贯
      politicsStatus: undefined, // 政治面貌
      university: undefined, // 毕业院校
      dutyType: undefined, // 身份类别
      degree: undefined, // 学历
      incumbent: null, // 是否在职
      major: undefined, // 专业
      duty: undefined, // 职务
      credentials: undefined, // 资格证书
      title: undefined, // 职称
      certificateNo: undefined, // 证书编号
      unitId: undefined, // 工作单位
      telphone: undefined, // 电话
      number: undefined, // 警员编号
      groupId: undefined, // 所属中队
      role: undefined, // 角色
      remark: undefined, // 个人履历
    };
  }
  componentWillMount() {
    console.log(this.props.dutyList);
    //工作单位
    React.$ajax.postData('/api/basicData/workUnitList').then((res) => {
      if (res.code == 0) {
        this.setState({ workUnitList: res.data });
      }
    });
    //角色
    React.$ajax.postData('/api/userCenter/roles').then((res) => {
      if (res.code == 0) {
        this.setState({ roleList: res.data });
      }
    });
    //所属中队
    React.$ajax.postData('/api/basicData/userGroup').then((res) => {
      if (res.code == 0) {
        this.setState({ groupList: res.data });
      }
    });
    const formStatus =
      util.urlParse(this.props.location.search) && util.urlParse(this.props.location.search).formStatus;
    const userId = util.urlParse(this.props.location.search) && util.urlParse(this.props.location.search).userId;

    this.setState({ userId });

    if (formStatus == 'view') {
      this.setState({ disabled: true });
      userId && this.getDetal(userId);
    } else if (formStatus == 'edit') {
      this.setState({ disabled: false });
      userId && this.getDetal(userId);
    } else if (formStatus == 'add') {
      this.setState({ disabled: false });
    }
  }
  handleCancel = () => this.setState({ previewVisible: false });
  getDetal = (userId) => {
    React.$ajax.postData('/api/user/info', { id: userId }).then((res) => {
      if (res.code == 0) {
        let resData = res.data;
        // this.setState({ userInfor: res.data });
        console.log('res.data');
        console.log(res.data);
        let { name, duty, groupId, incumbent, number, remark, role, telphone, unitId } = resData;
        this.setState({ name, duty, groupId, incumbent, number, remark, role, telphone, unitId });
      }
    });
  };
  handlePreview = (params) => {
    this.setState({
      previewVisible: true,
    });
  };
  handleChange = (fileList) => {
    this.setState({ fileList });
  };
  beforeUpload(file) {
    let _this = this;
    let url = window.URL.createObjectURL(file);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }
    if (isLt2M) {
      this.setState(({ fileList }) => ({
        fileList: [...fileList, file],
        previewImage: url,
      }));
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
  handleClear = () => {
    this.setState({ fileList: [], previewImage: '' });
  };
  //检查警员编号是否重复
  checkNumber = (rule, value, callback) => {
    const numberValue = this.props.form.getFieldValue('number');
    const { userInfor, isInitialValue } = this.state;
    let param = new FormData();
    const userNumber = userInfor && userInfor.number;
    let configs = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    param.append('number', value);
    const re = /^[A-Za-z\d]{1,20}$/;
    if (re.test(value)) {
      React.$ajax.formDataPost('/api/user/isNotExistence', param, 'multipart/form-data').then((res) => {
        if (!res.data && userNumber != value) {
          callback('警员编号重复');
        } else {
          callback();
        }
      });
    } else {
      if (value == '') {
        callback();
      } else {
        callback('警员编号不能为空且长度不超过20的数字或字母');
      }
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.props.userInfo);
    console.log('this.props.userInfo');
    let { userId } = this.state;
    let userInfo = this.props.userInfo;
    const successMess = userId ? '修改成功' : '添加成功';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.birthday = values.birthday ? moment(values.birthday).format('x') : null;
        let obj = Object.assign({}, values, { id: userId, userId: userInfo.id.toString() });
        React.$ajax.postData('/api/user/saveInfo', obj).then((res) => {
          if (res && res.code == 0) {
            this.props.history.push('/app/user/info/list');
            message.success(successMess);
          }
        });
      }
    });
  };
  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   const { userId, fileList, userInfor } = this.state;
  //   const { id } = JSON.parse(sessionStorage.getItem('user'));
  //   const successMess = userId ? '修改成功' : '添加成功';
  //   const errorMess = userId ? '修改失败' : '添加失败';
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       const options = values;
  //       console.log('values===123');
  //       console.log(values);
  //       let param = new FormData(); // 创建form对象
  //       if (options.birthday) {
  //         options.birthday = moment(new Date(values.birthday)).format('YYYY-MM-DD');
  //       }
  //       Object.keys(options).forEach((item, index) => {
  //         if (options[item] != undefined || options[item] != '') {
  //           param.append(item, options[item]);
  //         }
  //       });
  //       if (fileList && userInfor.photo) {
  //         param.append('photoFile', fileList.pop());
  //         param.append('imgOperation', 1);
  //       } else {
  //         param.append('photoFile', fileList.pop());
  //         param.append('imgOperation', 0);
  //       }
  //       let configs = {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       };
  //       if (userId) {
  //         param.append('id', userId);
  //       }
  //       param.append('userId', id);

  //       React.$ajax.formDataPost('/api/user/saveInfo', param, 'multipart/form-data').then((res) => {
  //         if (res && res.code == 0) {
  //           this.props.history.push('/app/user/info');
  //           message.success(successMess);
  //         }
  //       });
  //     }
  //   });
  // };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      showImgUrl,
      previewVisible,
      previewImage,
      fileList,
      imageUrl,
      disabled,
      workUnitList,
      roleList,
      groupList,
    } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className="AddDogForm">
        <Row gutter={24}>
          <Col span={24}>
            <Card title="警员信息" bordered={true}>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="姓名" {...secondLayout}>
                        {getFieldDecorator('name', {
                          rules: [
                            { required: true, message: '请输入姓名' },
                            { max: 10, message: '姓名长度不超过10' },
                          ],
                          initialValue: this.state.name,
                        })(<Input placeholder="警员姓名" autoComplete="off" disabled={disabled} allowClear />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="身份证" {...secondLayout}>
                        {getFieldDecorator('identityNo', {
                          //rules:[{required:true,message:'请输入犬只名称'}],
                          rules: [
                            {
                              pattern: '(^[0-9]{15}$)|(^[0-9]{18}$)|(^[0-9]{17}([0-9]|X|x)$)',
                              message: '身份证输入不合法',
                            },
                          ],
                          initialValue: this.state.identityNo,
                        })(<Input placeholder="身份证" disabled={disabled} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="性别" {...secondLayout}>
                        {getFieldDecorator('sex', {
                          //rules: [{ required: true, message: '请选择性别' }],
                          initialValue: this.state.sex,
                        })(
                          <RadioGroup disabled={disabled}>
                            <Radio value={1}>男</Radio>
                            <Radio value={0}>女</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="出生日期" {...secondLayout}>
                        {getFieldDecorator('birthday', {
                          //rules:[{required:true,message:'请选择出生日期'}],
                          initialValue: this.state.birthday,
                        })(<DatePicker disabled={disabled} style={{ width: '100%' }} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="民族" {...secondLayout}>
                        {getFieldDecorator('nation', {
                          //rules: [{ required: true, message: '请输入民族' }],
                          rules: [{ max: 10, message: '民族长度不超过10' }],
                          initialValue: this.state.birthday,
                        })(<Input placeholder="民族" autoComplete="off" disabled={disabled} allowClear />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="籍贯" {...secondLayout}>
                        {getFieldDecorator('birthplace', {
                          //rules:[{required:true,message:'请输入籍贯'}],
                          rules: [{ max: 25, message: '籍贯长度不超过25' }],
                          initialValue: this.state.birthplace,
                        })(<Input placeholder="籍贯" disabled={disabled} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="政治面貌" {...secondLayout}>
                        {getFieldDecorator('politicsStatus', {
                          //rules: [{ required: true, message: '请选择政治面貌' }],
                          initialValue: this.state.politicsStatus,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {formData.politicsStatusArr.map((item, index) => {
                              return (
                                <Option value={item.id} key={index}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="毕业院校" {...secondLayout}>
                        {getFieldDecorator('university', {
                          //rules:[{required:true,message:'请输入毕业院校'}],
                          rules: [{ max: 25, message: '籍贯长度不超过25' }],
                          initialValue: this.state.university,
                        })(<Input placeholder="毕业院校" disabled={disabled} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="身份类别" {...secondLayout}>
                        {getFieldDecorator('dutyType', {
                          //rules: [{ required: true, message: '请选择身份类别' }],
                          initialValue: this.state.dutyType,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {formData.dutyTypeArr.map((item, index) => {
                              return (
                                <Option value={item.id} key={index}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="学历" {...secondLayout}>
                        {getFieldDecorator('degree', {
                          //rules:[{required:true,message:'请选择学历'}],
                          initialValue: this.state.degree,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {formData.degreeArr.map((item, index) => {
                              return (
                                <Option value={item.id} key={index}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="是否在职" {...secondLayout}>
                        {getFieldDecorator('incumbent', {
                          //rules: [{ required: true, message: '是否在职' }],
                          initialValue: this.state.incumbent,
                        })(
                          <RadioGroup disabled={disabled}>
                            <Radio value={0}>离职</Radio>
                            <Radio value={1}>在职</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="专业" {...secondLayout}>
                        {getFieldDecorator('major', {
                          //rules:[{required:true,message:'请选择专业'}],
                          initialValue: this.state.major,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {formData.majorArr.map((item, index) => {
                              return (
                                <Option value={item.id} key={index}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="职务" {...secondLayout}>
                        {getFieldDecorator('duty', {
                          //rules: [{ required: true, message: '请选择职务' }],
                          initialValue: this.state.duty,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {this.props.dutyList &&
                              this.props.dutyList.map((item, index) => {
                                return (
                                  <Option value={Number(item.id)} key={index}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="资格证书" {...secondLayout}>
                        {getFieldDecorator('credentials', {
                          //rules: [{ required: true, message: '请选择资格证书' }],
                          initialValue: this.state.credentials,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {formData.credentialsArr.map((item, index) => {
                              return (
                                <Option value={item.id} key={index}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="职称" {...secondLayout}>
                        {getFieldDecorator('title', {
                          //rules: [{ required: true, message: '请选择职称' }],
                          initialValue: this.state.title,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {formData.titleArr.map((item, index) => {
                              return (
                                <Option value={item.id} key={index}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="证书编号" {...secondLayout}>
                        {getFieldDecorator('certificateNo', {
                          //rules: [{ required: true, message: '请填写证书编号' }],
                          rules: [{ pattern: '^[A-Za-z0-9]{1,20}$', message: '证书编号长度不超过20的数字或字母' }],
                          initialValue: this.state.certificateNo,
                        })(<Input placeholder="证书编号" disabled={disabled} allowClear />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="工作单位" {...secondLayout}>
                        {getFieldDecorator('unitId', {
                          //rules: [{ required: true, message: '请选择工作单位' }],
                          initialValue: this.state.unitId,
                        })(
                          <Select
                            disabled={disabled}
                            allowClear
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            placeholder="请选择"
                          >
                            {workUnitList &&
                              workUnitList.map((item, index) => {
                                return (
                                  <Option value={Number(item.id)} key={index}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="电话" {...secondLayout}>
                        {getFieldDecorator('telphone', {
                          //rules: [{ required: true, message: '请填写电话号码' },{pattern:regExp.telphone,message:'请输入正确的手机号码格式'}],
                          rules: [
                            {
                              pattern: /^1[3|5|6|7|8|9]\d{9}$/g,
                              message: '请输入正确的手机号码格式',
                            },
                          ],
                          initialValue: this.state.telphone,
                        })(<Input placeholder="电话号码" autoComplete="off" disabled={disabled} allowClear />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="警员编号" {...secondLayout}>
                        {getFieldDecorator('number', {
                          rules: [
                            { required: true, whitespace: true, message: '请填写警员编号' },
                            { validator: this.checkNumber },
                          ],
                          initialValue: this.state.number,
                        })(<Input placeholder="警员编号" disabled={disabled} allowClear />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="所属中队" {...secondLayout}>
                        {getFieldDecorator('groupId', {
                          //rules: [{ required: true, message: '请选择所属中队' }],
                          initialValue: this.state.groupId,
                        })(
                          <Select
                            disabled={disabled}
                            allowClear
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                          >
                            {groupList &&
                              groupList.map((item, index) => {
                                return (
                                  <Option value={Number(item.id)} key={index}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="角色" {...secondLayout}>
                        {getFieldDecorator('role', {
                          rules: [{ required: true, message: '请选择角色' }],
                          initialValue: this.state.role,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {roleList &&
                              roleList.map((item, index) => {
                                return (
                                  <Option value={item.id} key={index}>
                                    {item.description}
                                  </Option>
                                );
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <FormItem label="个人履历" {...firstLayout}>
                    {getFieldDecorator('remark', {
                      //rules: [{ required: true, message: '请输入个人履历' }],
                      rules: [{ max: 500, message: '个人履历长度不超过500' }],
                      initialValue: this.state.remark,
                    })(
                      <TextArea
                        placeholder="个人履历"
                        allowClear
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        disabled={disabled}
                      />
                    )}
                  </FormItem>
                  <FormItem label="警员图片" {...firstLayout}>
                    {/* <Upload
                      className="imageContent"
                      name="photoFile"
                      action={config.apiUrl + '/api/user/saveInfo'}
                      disabled={disabled}
                      accept="image/*"
                      listType="picture-card"
                      onChange={this.handleChange.bind(this)}
                      beforeUpload={this.beforeUpload.bind(this)}
                    >
                      {isInitialValue && userInfor.photo ? (
                        fileList.length == 0 ? (
                          <img
                            src={config.apiUrl + `/api/user/img?id=${userId}&t=${new Date().getTime()}`}
                            style={{ width: '100px', height: '100px' }}
                            alt=""
                          />
                        ) : (
                          uploadButton
                        )
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                    {previewImage ? (
                      <div className="pre-container">
                        <img
                          src={previewImage}
                          style={{ width: '100px', height: '100px' }}
                          alt=""
                          onClick={() => this.handlePreview()}
                        />
                        <Icon type="close-circle-o" className="clear" onClick={() => this.handleClear()} />
                      </div>
                    ) : null}
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal> */}
                  </FormItem>

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
const AddUserForm = Form.create()(FormCompomnent);

const mapStateToProps = (state) => ({
  loginState: state.login,
});
export default connect(mapStateToProps)(AddUserForm);
