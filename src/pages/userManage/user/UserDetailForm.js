import React from 'react';
import {Row, Col, Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload} from 'antd';
import {firstLayout, secondLayout} from 'util/Layout';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const {TextArea} = Input;
class AddUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      imageUrl: '',
      userId: '',
      isEdit: true
    };
  }
  componentWillMount() {
    this.setState({userId: this.props.location.query && this.props.location.query.userId});
    const text = this.props.location.query && this.props.location.query.targetText;
    if (text == '查看') {
      this.setState({isEdit: false});
    } else if (text == '编辑') {
      this.setState({isEdit: true});
    }
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleCancel = () => {
    this.setState({previewVisible: false});
  };
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleChange = (info) => {
    // if (info.file.status === 'uploading') {
    //      this.setState({ loading: true });
    //      return;
    //    }
    //if (info.file.status === 'done') {
    // Get this url from response in real world.
    this.getBase64(info.file.originFileObj, (imageUrl) => {
      this.setState({
        imageUrl,
        loading: false
      });
    });
    //}
  };
  beforeUpload = (file) => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //     message.error('You can only upload JPG file!');
    // }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //     message.error('Image must smaller than 2MB!');
    // }
    // return isJPG && isLt2M;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      debugger;
    });
  };
  render() {
    const {getFieldDecorator} = this.props.form;
    const {fileList, imageUrl} = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
      listType: 'picture-card'
    };
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col span={24}>
            <Card title="警员信息" bordered>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="姓名" {...secondLayout} hasFeedback>
                        {getFieldDecorator('userName', {
                          rules: [{required: true, message: '请输入姓名'}]
                        })(<Input placeholder="警员姓名" />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="身份证" {...secondLayout} hasFeedback>
                        {getFieldDecorator('userId', {
                          rules: [{required: true, message: '请输入身份证号'}]
                        })(<Input placeholder="身份证" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="性别" {...secondLayout}>
                        {getFieldDecorator('sex', {
                          rules: [{required: true, message: '请选择性别'}],
                          initialValue: '0'
                        })(
                          <RadioGroup>
                            <Radio value="0">男</Radio>
                            <Radio value="1">女</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="出生日期" {...secondLayout}>
                        {getFieldDecorator('birthDate', {
                          initialValue: null,
                          rules: [{required: true, message: '请选择出生日期'}]
                        })(<DatePicker />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="民族" {...secondLayout} hasFeedback>
                        {getFieldDecorator('national', {
                          rules: [{required: true, message: '请输入民族'}]
                        })(<Input placeholder="民族" />)}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="籍贯" {...secondLayout} hasFeedback>
                        {getFieldDecorator('nativePlace', {
                          rules: [{required: true, message: '请输入籍贯'}]
                        })(<Input placeholder="籍贯" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="政治面貌" {...secondLayout} hasFeedback>
                        {getFieldDecorator('politicalType', {
                          rules: [{required: true, message: '请选择政治面貌'}]
                        })(
                          <Select>
                            <Option value="0">团员</Option>
                            <Option value="1">党员</Option>
                            <Option value="2">学生</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="毕业院校" {...secondLayout}>
                        {getFieldDecorator('graduateSchool', {
                          rules: [{required: true, message: '请输入毕业院校'}]
                        })(<Input placeholder="毕业院校" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="身份类别" {...secondLayout}>
                        {getFieldDecorator('identityType', {
                          rules: [{required: true, message: '请选择身份类别'}]
                        })(
                          <Select>
                            <Option value="0">团员</Option>
                            <Option value="1">党员</Option>
                            <Option value="2">学生</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="学历" {...secondLayout}>
                        {getFieldDecorator('recordFormal', {
                          rules: [{required: true, message: '请选择学历'}]
                        })(
                          <Select>
                            <Option value="0">大专</Option>
                            <Option value="1">本科</Option>
                            <Option value="2">研究生</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="是否在职" {...secondLayout}>
                        {getFieldDecorator('isWork', {
                          rules: [{required: true, message: '是否在职'}],
                          initialValue: '0'
                        })(
                          <RadioGroup>
                            <Radio value="0">是</Radio>
                            <Radio value="1">否</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="专业" {...secondLayout}>
                        {getFieldDecorator('professional', {
                          rules: [{required: true, message: '请选择专业'}]
                        })(
                          <Select>
                            <Option value="0">计算机</Option>
                            <Option value="1">影视</Option>
                            <Option value="2">新闻</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="职务" {...secondLayout} hasFeedback>
                        {getFieldDecorator('position', {
                          rules: [{required: true, message: '请选择职务'}]
                        })(
                          <Select>
                            <Option value="0">中级</Option>
                            <Option value="1">高级</Option>
                            <Option value="2">学生</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="资格证书" {...secondLayout} hasFeedback>
                        {getFieldDecorator('certificate', {
                          rules: [{required: true, message: '请选择资格证书'}]
                        })(
                          <Select>
                            <Option value="0">学士</Option>
                            <Option value="1">博士</Option>
                            <Option value="2">博士2</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="职称" {...secondLayout} hasFeedback>
                        {getFieldDecorator('positionName', {
                          rules: [{required: true, message: '请选择职称'}]
                        })(
                          <Select>
                            <Option value="0">团员</Option>
                            <Option value="1">党员</Option>
                            <Option value="2">学生</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="证书编号" {...secondLayout} hasFeedback>
                        {getFieldDecorator('certificateId', {
                          rules: [{required: true, message: '请填写证书编号'}]
                        })(<Input placeholder="证书编号" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="工作单位" {...secondLayout} hasFeedback>
                        {getFieldDecorator('workUnits', {
                          rules: [{required: true, message: '请选择工作单位'}]
                        })(
                          <Select>
                            <Option value="0">政府</Option>
                            <Option value="1">学校</Option>
                            <Option value="2">医院</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="电话" {...secondLayout} hasFeedback>
                        {getFieldDecorator('phoneNumber', {
                          rules: [{required: true, message: '请填写电话号码'}]
                        })(<Input placeholder="电话号码" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="警员编号" {...secondLayout} hasFeedback>
                        {getFieldDecorator('policeNumber', {
                          rules: [{required: true, message: '请填写警员编号'}]
                        })(
                          <Select>
                            <Option value="0">一中队</Option>
                            <Option value="1">二中队</Option>
                            <Option value="2">三中队</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="所属中队" {...secondLayout} hasFeedback>
                        {getFieldDecorator('commandDetachment', {
                          rules: [{required: true, message: '请选择所属中队'}]
                        })(<Input placeholder="所属中队" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <FormItem label="个人履历" {...firstLayout}>
                    {getFieldDecorator('personalRecord', {
                      rules: [{required: true, message: '请输入个人履历'}]
                    })(<TextArea placeholder="个人履历" autosize={{minRows: 3, maxRows: 6}} />)}
                  </FormItem>
                  <FormItem label="警员图片" {...firstLayout}>
                    {getFieldDecorator('policePhoto', {
                      rules: [{required: true, message: '请添加图片'}]
                    })(
                      <Upload fileList={fileList} {...props}>
                        {imageUrl ? (
                          <img src={imageUrl} alt="" style={{width: '128px', height: '128px'}} />
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    )}
                  </FormItem>
                  <Row>
                    <Col span={24} style={{textAlign: 'center', marginTop: '40px'}}>
                      <Button type="primary" htmlType="submit">
                        提交
                      </Button>
                      <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                        清空
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Form.create()(AddUserForm);
