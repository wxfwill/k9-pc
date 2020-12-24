import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload, message, Modal } from 'antd';
import { firstLayout, secondLayout } from 'util/Layout';
import * as formData from './userData';
import CustomUpload from 'components/Upload/customUpload';
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
      imageUrl: null,
      userId: null,
      disabled: false,
      previewVisible: false,
      previewImage: '',
      showImgUrl: '',
      formDataEle: {
        name: undefined, // 姓名
        identityNo: undefined, // 身份证
        sex: null, // 性别
        birthday: null, // 出生日期
        nation: undefined, // 名族
        birthPlace: undefined, // 籍贯
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
        roles: undefined, // 角色
        remark: undefined, // 个人履历
        workWxUserId: null, // 企业微信号
      },
    };
  }
  componentWillMount() {
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
    userId && this.setState({ userId });

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
  handleReset = () => {
    this.props.history.goBack();
  };
  handleCancel = () => this.setState({ previewVisible: false });
  getDetal = (userId) => {
    React.$ajax.getData('/api/user/queryUserInfoByUserId', { userId }).then((res) => {
      if (res.code == 0) {
        let resData = res.data ? res.data : {};
        resData.birthday = resData.birthday ? moment(resData.birthday) : null;
        resData.roles = resData.roles ? resData.roles[0].roleId.toString() : undefined;
        resData.groupId = resData.groupId ? resData.groupId.toString() : undefined;
        // 警员图片
        resData.photo = resData.photo ? resData.photo.toString() : null;

        for (let key in resData) {
          if (key != 'birthday' && !resData[key] && resData[key] != 0) {
            resData[key] = undefined;
          }
        }
        let obj = Object.assign({}, this.state.formDataEle, resData);
        this.setState({ formDataEle: obj });
      }
    });
  };
  async handleChangeNumber() {
    console.log('change');
  }
  newHandleNumber = () => {
    console.log('开始');
    this.props.form.validateFields(['number'], (err, values) => {
      if (!err) {
        console.log(this.props.form.getFieldValue('number'));
        console.log(this.state.userId);
      }
    });
  };
  // 自定义警员编号校验
  checkNumber = (rule, value, callback) => {
    const re = /^[A-Za-z\d]{1,20}$/;
    if (value && re.test(value)) {
      this.isRepeatNumber(value, callback);
    } else {
      value ? callback('警员编号由不超过20个数字或字母组成') : callback();
    }
  };
  // 检查警员编号是否重复
  isRepeatNumber = util.Debounce(
    (value, callback) => {
      React.$ajax
        .getData('/api/user/isNotExistence', {
          newNumber: value,
          userId: this.state.userId,
        })
        .then((res) => {
          if (!res.data || this.props.userInfo.account == value) {
            callback('警员编号重复');
          } else {
            callback();
          }
        });
    },
    300,
    false
  );
  handleSubmit = (e) => {
    e.preventDefault();
    let { userId } = this.state;
    let userInfo = this.props.userInfo;
    const successMess = userId ? '修改成功' : '添加成功';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.birthday = values.birthday ? moment(values.birthday).format('x') : null;
        values.roles = [{ roleId: values.roles }];
        let obj = Object.assign({}, values, { id: userId, userId: userInfo.id.toString() });
        React.$ajax.postData('/api/user/createUser', obj).then((res) => {
          if (res && res.code == 0) {
            this.props.history.push('/app/user/info/list');
            message.success(successMess);
          }
        });
      }
    });
  };
  getchildmsg = (msg) => {
    if (msg) {
      let obj = Object.assign({}, this.state.formDataEle, { photo: msg });
      this.setState({ formDataEle: obj }, () => {
        this.props.form.resetFields(['photo']);
      });
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let { formDataEle, disabled, workUnitList, roleList, groupList } = this.state;
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
                          initialValue: formDataEle.name,
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
                          initialValue: formDataEle.identityNo,
                        })(<Input placeholder="身份证" disabled={disabled} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="性别" {...secondLayout}>
                        {getFieldDecorator('sex', {
                          //rules: [{ required: true, message: '请选择性别' }],
                          initialValue: formDataEle.sex,
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
                          initialValue: formDataEle.birthday,
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
                          initialValue: formDataEle.nation,
                        })(<Input placeholder="民族" autoComplete="off" disabled={disabled} allowClear />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="籍贯" {...secondLayout}>
                        {getFieldDecorator('birthPlace', {
                          //rules:[{required:true,message:'请输入籍贯'}],
                          rules: [{ max: 25, message: '籍贯长度不超过25' }],
                          initialValue: formDataEle.birthPlace,
                        })(<Input placeholder="籍贯" disabled={disabled} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="政治面貌" {...secondLayout}>
                        {getFieldDecorator('politicsStatus', {
                          //rules: [{ required: true, message: '请选择政治面貌' }],
                          initialValue: formDataEle.politicsStatus,
                        })(
                          <Select
                            disabled={disabled}
                            placeholder="请选择"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                          >
                            {formData &&
                              formData.politicsStatusArr.map((item, index) => {
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
                          initialValue: formDataEle.university,
                        })(<Input placeholder="毕业院校" disabled={disabled} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="身份类别" {...secondLayout}>
                        {getFieldDecorator('dutyType', {
                          //rules: [{ required: true, message: '请选择身份类别' }],
                          initialValue: formDataEle.dutyType,
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
                          initialValue: formDataEle.degree,
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
                          initialValue: formDataEle.incumbent,
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
                          initialValue: formDataEle.major,
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
                          initialValue: formDataEle.duty,
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
                          initialValue: formDataEle.credentials,
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
                          initialValue: formDataEle.title,
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
                          initialValue: formDataEle.certificateNo,
                        })(<Input placeholder="证书编号" disabled={disabled} allowClear />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="工作单位" {...secondLayout}>
                        {getFieldDecorator('unitId', {
                          //rules: [{ required: true, message: '请选择工作单位' }],
                          initialValue: formDataEle.unitId,
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
                          initialValue: formDataEle.telphone,
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
                            // { pattern: /^[A-Za-z\d]{1,20}$/, message: '警员编号由不超过20个数字或字母组成' },
                            { validator: this.checkNumber },
                          ],
                          initialValue: formDataEle.number,
                        })(
                          <Input
                            placeholder="警员编号"
                            disabled={disabled}
                            allowClear
                            // onChange={(e) => this.handleChangeNumber().then(this.newHandleNumber)}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="所属中队" {...secondLayout}>
                        {getFieldDecorator('groupId', {
                          //rules: [{ required: true, message: '请选择所属中队' }],
                          initialValue: formDataEle.groupId,
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
                      <FormItem label="角色" {...secondLayout}>
                        {getFieldDecorator('roles', {
                          rules: [{ required: true, message: '请选择角色' }],
                          initialValue: formDataEle.roles,
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
                                    {item.roleName}
                                  </Option>
                                );
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="企业微信号" {...secondLayout}>
                        {getFieldDecorator('workWxUserId', {
                          rules: [{ required: false, message: '请输入' }],
                          initialValue: formDataEle.workWxUserId,
                        })(<Input placeholder="请输入" disabled={disabled} allowClear />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <FormItem label="个人履历" {...firstLayout}>
                    {getFieldDecorator('remark', {
                      rules: [{ max: 500, message: '个人履历长度不超过500' }],
                      initialValue: formDataEle.remark,
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
                    {getFieldDecorator('photo', {
                      rules: [{ required: true, message: '请上传警员图片' }],
                      initialValue: formDataEle.photo,
                    })(
                      <CustomUpload
                        photoUrl={formDataEle.photo}
                        parent={this}
                        key={new Date().getTime()}
                      ></CustomUpload>
                    )}

                    {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
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
                          返回
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

export default AddUserForm;
