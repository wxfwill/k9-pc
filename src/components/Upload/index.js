import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
import { connect } from 'react-redux';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@connect(
  (state) => ({ token: state.loginReducer.token })
  // (dispatch) => ({ changeNavData: (nav) => dispatch(changeNavName(nav)) })
)
class CustomUpload extends React.Component {
  state = {
    loading: false,
    imageUrl: (() => {
      // console.log(this.props.imgUrl);
      return this.props.imgUrl || null;
    })(),
    file: null,
    icon: null,
  };
  beforeUpload = (file) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('图片格式错误');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片最大不超过2M!');
    }
    window.File = false;
    let formData = new FormData();
    formData.append('file', file);
    this.setState({
      formData,
      file,
    });
    // return isJpgOrPng && isLt2M;
    return isLt2M;
  };
  handleChange = (info) => {
    console.log(info);

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      console.log(info);
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
      if (info.file.response && info.file.response.code == 0) {
        this.setState({ icon: info.file.response.data });
        if (this.props.selectType == 'default') {
          // 默认
          this.props.parent.getIconUrl(info.file.response.data, 'default');
        } else {
          this.props.parent.getIconUrl(info.file.response.data, 'light');
        }
      }
    }
  };
  componentDidMount() {
    console.log(process.env.BASE_URL);
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{this.state.loading ? '上传中' : '开始上传'}</div>
      </div>
    );
    const { imageUrl, file, formData } = this.state;
    return (
      <Upload
        key={this.props.iconKey || 'upload'}
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        data={{ file: formData }}
        headers={{ k9token: this.props.token }}
        accept=".png, .jpg, .jpeg, .svg"
        action={process.env.BASE_URL + '/api/sys-appNavigation/uploadImg'}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '88px' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default CustomUpload;
