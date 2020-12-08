import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload, message, Modal } from 'antd';
import { firstLayout, secondLayout } from 'util/Layout';
require('style/app/dogInfo/addDogForm.less');
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;

class VideoInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInitialValue: false,
      disabled: false,
      uniqueNo: '',
      name: '',
      dogList: [],
      videoData: {},
    };
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      let count = 0,
        obj = {};
      if (!err) {
        const { uniqueNo, name } = this.state;
        const VideoId = this.props.location.query && this.props.location.query.VideoId;

        const successMess = VideoId ? '修改成功' : '添加成功';
        const errorMess = VideoId ? '修改失败' : '添加失败';
        const parms = { uniqueNo, name, dogId: values.dogId };
        if (VideoId) {
          parms.id = VideoId;
        }
        React.$ajax
          .postData('/api/braceletInfo/saveInfo', parms)
          .then((res) => {
            if (res.code == 0) {
              this.props.history.push('/app/equipment/bracelet');
              message.success(successMess);
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

  searchDog = (name = '') => {
    React.$ajax.postData('/api/dog/listAll', { name }).then((res) => {
      if (res.code == 0) {
        this.setState({ dogList: res.data });
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  componentDidMount() {
    this.searchDog();
    const VideoId = this.props.location.query && this.props.location.query.VideoId;
    const pathname = this.props.location.pathname;
    if (VideoId) {
      React.$ajax
        .postData('/api/braceletInfo/info', { id: VideoId })
        .then((res) => {
          if (res.code == 0) {
            this.setState({ videoData: res.data, ...res.data });
          } else {
            message.error('请求失败');
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (pathname.indexOf('Detail') > -1) {
        this.setState({ isInitialValue: true, disabled: true });
      } else {
        this.setState({ isInitialValue: true, disabled: false });
      }
    }
  }

  render() {
    // console.log(this.props,this.state, 'asdasdq')
    const { getFieldDecorator } = this.props.form;
    const { isInitialValue, disabled, videoData, dogList } = this.state;
    return (
      <div className="AddDogForm">
        <Row gutter={24}>
          <Col span={24}>
            <Card title="颈环信息" bordered={true}>
              <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                <Form className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="颈环编号" {...secondLayout} hasFeedback>
                        {getFieldDecorator('uniqueNo', {
                          rules: [
                            { required: true, whitespace: true, message: '请输入颈环编号' },
                            { validator: this.checkNumber },
                          ],
                          initialValue: isInitialValue ? videoData.uniqueNo : '',
                        })(
                          <Input
                            placeholder="颈环编号"
                            onChange={(e) => {
                              this.setState({ uniqueNo: e.target.value });
                            }}
                            disabled={disabled}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="名称" {...secondLayout} hasFeedback>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入名称' }],
                          initialValue: isInitialValue ? videoData.name : '',
                        })(
                          <Input
                            placeholder="名称"
                            onChange={(e) => {
                              this.setState({ name: e.target.value });
                            }}
                            disabled={disabled}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                      <FormItem label="警犬" {...secondLayout} hasFeedback>
                        {getFieldDecorator('dogId', {
                          //   rules: [{ required: true,whitespace:true, message: '请选择警犬' },{validator: this.checkNumber}],
                          initialValue: isInitialValue ? videoData.dogId : '',
                        })(
                          <Select
                            placeholder="警犬"
                            optionLabelProp="children"
                            showSearch
                            autosize={{ minRows: 2, maxRows: 24 }}
                            disabled={disabled}
                            filterOption={(input, option) =>
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {dogList.map((item) => (
                              <Option value={item.id} key={item.id + '_dog'}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {
                    //     <Row gutter={24}>
                    //             <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    //             <FormItem label='备注' {...secondLayout}  hasFeedback>
                    //                 {getFieldDecorator('beizhu',{
                    //                  // rules: [{ required: true,whitespace:true, message: '请输入档案编号' },{validator: this.checkNumber}],
                    //                  initialValue:isInitialValue?videoData.remark :""
                    //              })(
                    //                 <TextArea placeholder="备注" onChange={(e) => {this.setState({remark: e.target.value})}} autosize={{ minRows: 3, maxRows: 6 }} disabled={disabled}/>
                    //               )}
                    //             </FormItem>
                    //       </Col>
                    //   </Row>
                  }

                  {!disabled ? (
                    <Row>
                      <Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
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

const AddViewForm = Form.create()(VideoInfo);

const mapStateToProps = (state) => ({
  loginState: state.login,
});
export default connect(mapStateToProps)(AddViewForm);

// WEBPACK FOOTER //
// ./src/components/admin/bracelet/BraceletEdit.js
