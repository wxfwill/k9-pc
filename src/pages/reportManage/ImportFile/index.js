import React, { Component } from 'react';
import { Row, Col, Card, Button, Input, Select, message, Typography, Upload } from 'antd';
import 'style/pages/reportManage/ImportFile/index.less';

const { Title } = Typography;
const InputGroup = Input.Group;
const { Option } = Select;

//文件类型列表
const fileTypeList = [
  {
    label: '日报',
    value: '日报',
  },
  // {
  //   label: '考勤',
  //   value: '考勤',
  // },
];
//上传的文件类型 .xls,.xlsx
const accept = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

class ImportFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileType: '日报',
      file: null,
      fileName: '',
      isImport: false,
    };
  }
  componentDidMount() {
    React.store.dispatch({ type: 'NAV_DATA', nav: ['上报管理', '导入4w报备'] });
  }
  handleChange = (value) => {
    this.setState({
      fileType: value,
    });
  };
  // 选择文件
  beforeUpload = (file) => {
    this.setState(
      {
        fileName: file.name,
        file: file,
      },
      () => {
        this.setState({
          isImport: true,
        });
      }
    );
    return false; //手动上传，返回false
  };
  //取消导入
  onCancel = () => {
    this.setState({
      file: null,
      fileName: '',
      isImport: false,
    });
  };
  //导入
  onSubmit = () => {
    const { file, fileType } = this.state;
    if (!file) {
      message.error('请选择需要导入的文件！');
      return;
    }
    let $url = '';
    if (fileType == '日报') {
      $url = '/api/report/dailyWorkImport';
    }
    let formData = new FormData();
    formData.append('file', file);
    React.$ajax.postData($url, formData).then((res) => {
      console.log(res);
      if (res && res.code === 0) {
        message.success('导入成功！');
        this.onCancel();
      }
    });
  };

  render() {
    const { fileType, fileName, isImport } = this.state;
    return (
      <Row className="import-file">
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false}>
            <Title level={4} className="txt-c">
              企业微信文件导入
            </Title>
            <InputGroup compact className="txt-c">
              <Select value={fileType} onChange={this.handleChange} style={{ width: 108 }}>
                {fileTypeList && fileTypeList.length > 0
                  ? fileTypeList.map((item) => {
                      return (
                        <Option value={item.value} key={item.value}>
                          {item.label}
                        </Option>
                      );
                    })
                  : null}
              </Select>
              <Input style={{ width: '40%' }} value={fileName} placeholder="请选择文件" />
              <Upload multiple showUploadList={false} beforeUpload={this.beforeUpload} accept={accept}>
                <Button type="primary">选择文件</Button>
              </Upload>
            </InputGroup>
            <div className="txt-c">
              <Button type="primary" disabled={!isImport} onClick={this.onSubmit}>
                导入
              </Button>
              <Button style={{ marginLeft: 16 }} onClick={this.onCancel}>
                取消
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default ImportFile;
